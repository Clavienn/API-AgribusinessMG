import path from "path";
import fs from "fs";
import XLSX from "xlsx";
import { fileURLToPath } from "url";
import Excel from "../models/Excel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const importerFichesTechniques = async (req, res) => {
  try {
    // Récupérer le dernier fichier Excel stocké en BD
    const lastExcel = await Excel.findOne().sort({ createdAt: -1 });

    if (!lastExcel) {
      return res.status(404).json({ error: "Aucun fichier Excel trouvé dans la base." });
    }

    // Construire le chemin complet vers le fichier
    const filePath = path.resolve(__dirname, `../uploads/${lastExcel.filePath}`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Fichier Excel introuvable sur le serveur." });
    }

    // Lire le fichier Excel
    const workbook = XLSX.readFile(filePath, { cellDates: true });
    const sheetName = workbook.SheetNames[0]; // Première feuille
    const sheet = workbook.Sheets[sheetName];

    // Convertir en JSON (⚠️ on ne met pas defval: "" pour éviter champs vides)
    const results = XLSX.utils.sheet_to_json(sheet, {
      raw: false, // Convertit nombres & dates proprement
    });

    // Nettoyage : supprimer les champs vides et formater
    const cleanedResults = results.map((row) => {
      const cleanedRow = {};
      for (let key in row) {
        let value = row[key];

        if (value === null || value === undefined || value === "") {
          continue; // ⛔ On ignore la colonne si valeur vide
        }

        let cleanKey = key.replace(/\s+/g, "_").trim();

        if (typeof value === "string") {
          value = value
            .replace(/\r\n/g, " ")
            .replace(/\?/g, "")
            .trim();

          if (/^\d+([,\.]\d+)?$/.test(value)) {
            value = parseFloat(value.replace(",", "."));
          }
        }

        cleanedRow[cleanKey] = value;
      }
      return cleanedRow;
    });

    return res.status(200).json({
      status: 200,
      fichier: lastExcel.filePath,
      total: cleanedResults.length,
      data: cleanedResults,
    });

  } catch (error) {
    console.error("Erreur import Excel:", error);
    return res.status(500).json({ error: "Erreur lors de l'import du fichier Excel." });
  }
};
