import express from "express";
import { importerFichesTechniques } from "../controllers/FicheTechniqueController.js";

const router = express.Router();

router.get("/import", importerFichesTechniques);

export default router;
