import express from "express";
import fileController from "../controllers/fileController";
import upload from "../middleware/fileUpload";

const router = express.Router();

router.get("/", fileController.getFiles);
router.get("/create", fileController.getCreateFile);
router.post(
  "/create",
  upload.single("fileUpload"),
  fileController.postCreateFile,
);
router.get("/:id", fileController.getFileDetails);

export default router;
