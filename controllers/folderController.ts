import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const index = async (req: Request, res: Response) => {
  const folders = await prisma.folder.findMany();
  res.render("folders", { title: "Folder list", folders });
};

export default {
  index,
};
