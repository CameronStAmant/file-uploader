import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const index = async (req: Request, res: Response) => {
  const folders = await prisma.folder.findMany({
    where: {
      userId: res.locals.currentUser.id,
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

const getFolderDetails = async (req: Request, res: Response) => {
  const folderId = parseInt(req.params.id as string);
  const folderDetails = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });

  const associatedFiles = await prisma.file.findMany({
    where: {
      folderId,
    },
  });

  res.render("folders/details", {
    title: `${folderDetails?.name} Details`,
    folder: folderDetails,
    files: associatedFiles,
  });
};

const postFolderUpdate = async (req: Request, res: Response) => {
  const folderId = parseInt(req.params.id as string);
  await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      name: req.body.name,
    },
  });

  res.redirect(`/folders/${folderId}`);
};

export default {
  index,
  getCreate,
  postCreate,
  getFolderDetails,
  postFolderUpdate,
};
