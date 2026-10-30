import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { unlink } from "node:fs";
import CustomNotFoundError from "../errors/CustomNotFoundError";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { randomUUID } from "node:crypto";

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
  const file = req.file;
  const folderId = req.body.folder;

  if (!file) {
    throw new CustomNotFoundError("File not attached");
  }
  if (!folderId) {
    throw new CustomNotFoundError("Folder not selected");
  }

  const supabase = createClient(
    `${process.env.SUPABASE_URL}`,
    `${process.env.SUPABASE_SECRET_KEY}`,
  );

  const { data, error } = await supabase.storage
    .from("Uploads")
    .upload(`${res.locals.currentUser.id}-${randomUUID()}`, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    console.error("Supabase upload failed:", error);
    throw error;
  }

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
      path: data.path,
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

  if (!fileDetails) {
    throw new CustomNotFoundError("File not found");
  }

  res.render("files/details", {
    title: `${fileDetails.name} details`,
    file: fileDetails,
  });
};

const getFileDownload = async (req: Request, res: Response) => {
  const file = await prisma.file.findUnique({
    where: {
      id: parseInt(req.params.id as string),
    },
  });

  if (!file) {
    throw new CustomNotFoundError("File not found");
  }

  const supabase = createClient(
    `${process.env.SUPABASE_URL}`,
    `${process.env.SUPABASE_SECRET_KEY}`,
  );

  const { data, error } = await supabase.storage
    .from("Uploads")
    .createSignedUrl(file.path, 3600, { download: file.name });

  if (error) {
    throw error;
  }

  res.redirect(data.signedUrl);
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
