import express from "express";
import folderController from "../controllers/folderController";

const router = express.Router();

router.get("/", folderController.index);

export default router;
