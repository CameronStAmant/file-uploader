import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const index = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.render("users", { title: "User list", users });
};

export default {
  index,
};
