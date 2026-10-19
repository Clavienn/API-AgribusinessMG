import express from "express";
import uploadExcel from "../middlewares/excelMiddleware.js";

import { addExcel, listExcels, updateExcel } from "../controllers/ExcelController.js";
const router = express.Router();
router.get("/", listExcels)

router.post("/", uploadExcel.single("file"), addExcel);
router.put("/:id", uploadExcel.single("file"), updateExcel);
export default router;