import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const getFiles = async (req: Request, res: Response) => {
  const files = await prisma.file.findMany({
    where: {
      userId: res.locals.currentUser.id,
    },
  });

  res.render("files", { title: "Files", files });
};

const getCreateFile = async (req: Request, res: Response) => {
  const folders = await prisma.folder.findMany({
    where: {
      userId: res.locals.currentUser.id,
    },
  });

  res.render("files/create", { title: "Upload File", folders });
};

const postCreateFile = async (req: Request, res: Response) => {
  const file = req.file!;
  const folderId = req.body.folder;

  await prisma.file.create({
    data: {
      name: file.originalname,
      fileSize: file.size,
      mimetype: file.mimetype,
      folder: {
        connect: { id: parseInt(folderId) },
      },
      user: {
        connect: { id: res.locals.currentUser.id },
      },
    },
  });
  res.redirect("/");
};

const getFileDetails = async (req: Request, res: Response) => {
  const fileDetails = await prisma.file.findUnique({
    where: {
      id: parseInt(req.params.id as string),
    },
  });

  res.render("files/details", {
    title: `${fileDetails?.name} details`,
    file: fileDetails,
  });
};

export default {
  getCreateFile,
  getFiles,
  postCreateFile,
  getFileDetails,
};
