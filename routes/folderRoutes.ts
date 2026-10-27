import express from "express";
import folderController from "../controllers/folderController";

const router = express.Router();

router.get("/", folderController.index);
router.get("/create", folderController.getCreate);
router.post("/create", folderController.postCreate);

export default router;
