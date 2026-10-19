
import Excel from "../models/Excel.js";
import fs from "fs";
import path from "path";



export const addExcel = async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }
    const newExcel = new Excel({
      filePath: req.file.filename,
    });
    await newExcel.save();
    res.status(201).json({
      message: "Fichier Excel ajouté avec succès",
      excel: newExcel,
    });
  } catch (error) {
    console.error("Erreur upload Excel:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const updateExcel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }
    const existingExcel = await Excel.findById(id);
    if (!existingExcel) {
      return res.status(404).json({ message: "Excel non trouvé" });
    }
    const oldPath = path.join("uploads", existingExcel.filePath);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
    existingExcel.filePath = req.file.filename;

    await existingExcel.save();
    res.status(200).json({
      message: "Fichier Excel mis à jour avec succès",
      excel: existingExcel,
    });

  } catch (error) {

    console.error("Erreur update Excel:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};



export const listExcels = async (req, res) => {
  try {
    const excels = await Excel.find().sort({ createdAt: -1 });
        // console.log(excels);

    res.status(200).json({ excels });
    
  } catch (error) {
    console.error("Erreur list Excel:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};