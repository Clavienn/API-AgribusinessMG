import express from "express";
import {
  createPlante,
  getPlantes,
  getPlanteById,
  updatePlante,
  deletePlante,
} from "../controllers/PlanteController.js";
import upload from "../middlewares/upload.js"

const router = express.Router();

router.post("/",upload.single("image"), createPlante);
router.get("/", getPlantes);
router.get("/:id", getPlanteById);
router.put("/:id",upload.single("image"), updatePlante);
router.delete("/:id", deletePlante);

export default router;
