import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const index = async (req: Request, res: Response) => {
  const folders = await prisma.folder.findMany({
    where: {
      id: res.locals.currentUser.id,
    },
  });
  res.render("folders/index", { title: "Folder list", folders });
};

const getCreate = (req: Request, res: Response) => {
  res.render("folders/create", { title: "Create Folder" });
};

const postCreate = async (req: Request, res: Response) => {
  await prisma.folder.create({
    data: {
      name: req.body.name,
      user: {
        connect: { id: res.locals.currentUser.id },
      },
    },
  });

  res.redirect("/folders");
};

export default {
  index,
  getCreate,
  postCreate,
};
