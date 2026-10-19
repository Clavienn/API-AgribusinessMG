import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import {
  InscriptionFormation,
  GetAllInscritFormations,
  GetInscritsForFormateur,
  UpdateStatutInscription,
  getInscriptions,
  exportInscriptionsCSV,
  exportInscriptionsExcel,
  getStatsInscriptions
} from "../controllers/InscritFormController.js";


router.post("/", authMiddleware, InscriptionFormation);

router.get("/", authMiddleware,authorizeRoles("admin"), GetAllInscritFormations);
router.get("/formateur", authMiddleware,authorizeRoles("admin","formateur"), GetInscritsForFormateur);
router.put("/statut/:id", authMiddleware,authorizeRoles("admin","formateur"), UpdateStatutInscription);
router.get("/filtre", authMiddleware,authorizeRoles("admin"), getInscriptions);
router.get("/export/csv", authMiddleware,authorizeRoles("admin","formateur"), exportInscriptionsCSV);
router.get("/export/excel", authMiddleware,authorizeRoles("admin","formateur"), exportInscriptionsExcel);
router.get("/stats", authMiddleware,authorizeRoles("admin"), getStatsInscriptions);

export default router;
