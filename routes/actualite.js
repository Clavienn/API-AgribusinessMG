import express from "express";
const router = express.Router();
import upload from "../middlewares/upload.js";

import { CreateActualite, GetAllActualites, GetActualiteById, UpdateActualite, DeleteActualite, GetAllActualiteApproved } from "../controllers/ActuController.js";
import authMiddleware from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";



router.get("/approved", GetAllActualiteApproved);
router.get("/", GetAllActualites);
router.get("/:id", GetActualiteById);

//Admin uniquement
router.post("/", authMiddleware, authorizeRoles("admin"), upload.single("image"), CreateActualite);
router.put("/:id", authMiddleware, authorizeRoles("admin"), upload.single("image"), UpdateActualite);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), DeleteActualite);

export default router;
