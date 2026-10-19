import path from "path";
import fs from "fs";
import csvParser from "csv-parser";
import iconv from "iconv-lite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Fonction utilitaire pour lire et nettoyer un CSV
const readCSV = async (fileName) => {
  const filePath = path.resolve(__dirname, `../uploads/${fileName}`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier ${fileName} introuvable.`);
  }

  const results = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(iconv.decodeStream("ISO-8859-1"))
      .pipe(csvParser({ separator: ";" }))
      .on("data", (row) => {
        const cleanedRow = {};
        for (let key in row) {
          let cleanKey = key.replace(/\s+/g, "_").trim();
          let value = row[key];

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
        results.push(cleanedRow);
      })
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });

  return results;
};

// 🔹 Exemple de fonctions qui réutilisent le helper
export const groupement = async (req, res) => {
  try {
    const results = await readCSV("Groupement.csv");
    return res.status(200).json({
      status: 200,
      total: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Erreur import CSV:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const instutPub = async (req, res) => {
  try {
    const results = await readCSV("publique.csv");
    return res.status(200).json({
      status: 200,
      total: results.length,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const Prive = async (req, res) => {
  try {
    const results = await readCSV("AnnuairePrive.csv");
    return res.status(200).json({
      status: 200,
      total: results.length,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const cc = async (req, res) => {
  try {
    const results = await readCSV("cc.csv");
    return res.status(200).json({
      status: 200,
      total: results.length,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const cci = async (req, res) => {
  try {
    const results = await readCSV("cci.csv");
    return res.status(200).json({
      status: 200,
      total: results.length,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const labo = async (req, res) => {
  try {
    const results = await readCSV("Labo.csv");
    return res.status(200).json({
      status: 200,
      total: results.length,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const machine = async (req, res) => {
  try {
    const results = await readCSV("Machine.csv");
    return res.status(200).json({
      status: 200,
      total: results.length,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const transit = async (req, res) => {
  try {
    const results = await readCSV("transit.csv");
    return res.status(200).json({
      status: 200,
      total: results.length,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const semence = async (req, res) => {
  try {
    const results = await readCSV("Semence.csv");
    return res.status(200).json({
      status: 200,
      total: results.length,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const ttm = async (req, res) => {
  try {
    const results = await readCSV("ttm.csv");
    return res.status(200).json({
      status: 200,
      total: results.length,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
