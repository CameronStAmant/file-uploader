import express from "express";
import folderController from "../controllers/folderController";

const router = express.Router();

router.get("/", folderController.index);
router.get("/create", folderController.getCreate);
router.post("/create", folderController.postCreate);
router.get("/:id", folderController.getFolderDetails);
router.post("/:id/update", folderController.postFolderUpdate);

export default router;
