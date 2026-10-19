import express from "express";
import { CreateFormation, GetAllFormations, GetFormationById, UpdateFormation, DeleteFormation } from "../controllers/FormationController.js";
import authMiddleware from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", GetAllFormations);
router.get("/:id", GetFormationById);
router.post("/", authMiddleware, authorizeRoles("formateur", "admin"), upload.single("graphique"), CreateFormation);
router.put("/:id", authMiddleware, upload.single("graphique"), UpdateFormation);
router.delete("/:id", authMiddleware, authorizeRoles("admin") , DeleteFormation);


export default router;
