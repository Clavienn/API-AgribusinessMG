import express from "express";
import {
  groupement,
  instutPub,
  Prive,
  cc,
  cci,
  labo,
  machine,
  transit,
  semence,
  ttm
} from "../controllers/AnnuaireController.js";

const router = express.Router();

router.post("/annuaireGroupement", groupement);
router.post("/annuaireInstut", instutPub);
router.post("/prive", Prive);
router.post("/cc", cc);
router.post("/cci", cci);
router.post("/labo", labo);
router.post("/machine", machine);
router.post("/transit", transit);
router.post("/semence", semence);
router.post("/ttm", ttm);

export default router;
