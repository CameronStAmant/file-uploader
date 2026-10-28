import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { unlink } from "node:fs";

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
      path: file.path,
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

const getFileDownload = async (req: Request, res: Response) => {
  const file = await prisma.file.findUnique({
    where: {
      id: parseInt(req.params.id as string),
    },
  });

  res.download(file?.path!);
};

const deleteFile = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const file = await prisma.file.findUnique({
    where: {
      id,
    },
  });

  await prisma.file.delete({
    where: {
      id,
    },
  });

  unlink(file?.path!, (err) => {
    if (err) throw err;
  });

  res.redirect("/");
};

export default {
  getCreateFile,
  getFiles,
  postCreateFile,
  getFileDetails,
  getFileDownload,
  deleteFile,
};
