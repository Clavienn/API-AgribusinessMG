import express from "express";
import { getContenus, updateContenuSection } from "../controllers/ContenuController.js";

const router = express.Router();

router.get("/", getContenus);
router.put("/:section", updateContenuSection);

export default router;
