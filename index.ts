import express, { Express, Request, Response } from "express";
import userRoutes from "./routes/userRoutes";

const app: Express = express();
app.set("view engine", "ejs");
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/login", (req: Request, res: Response) => {
  res.render("login", { title: "Login" });
});

app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
