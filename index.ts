import express, { Express, NextFunction, Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import folderRoutes from "./routes/folderRoutes";
import fileRoutes from "./routes/fileRoutes";
import expressSession from "express-session";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import isAuthenticated from "./middleware/isAuthenticated";

const app: Express = express();
app.set("view engine", "ejs");
const port = 3000;

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

app.use(
  expressSession({
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    secret: "aEvtBX%TA#SsQ*SSb*K8eGuGmAw^D#WgkMbQYMJQ$78!@DfWEzt58WZ*RGgUwoBo",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: username,
        },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.render("home", { title: "Home Page" });
});

app.get("/signup", (req: Request, res: Response) => {
  res.render("signup", { title: "Signup" });
});

app.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    await prisma.folder.create({
      data: {
        name: "Default",
        user: {
          connect: { id: newUser.id },
        },
      },
    });

    res.redirect("/login");
  } catch (err) {
    return next(err);
  }
});

app.get("/login", (req: Request, res: Response) => {
  res.render("login", { title: "Login", errors: req.session.messages });

  // Clear error messages once shown.
  req.session.messages = [];
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
);

app.use(isAuthenticated);

app.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.use("/users", userRoutes);
app.use("/folders", folderRoutes);
app.use("/files", fileRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
