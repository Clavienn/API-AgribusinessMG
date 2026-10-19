import Partenaire from '../models/Partenaire.js';
import { paginated } from '../utils/paginate.js';
import fs from 'fs';
import path from 'path';

export const createPartenaire = async (req, res) => {
  try {
    const { entite, information, status, region, partenariat_depuis, contact } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Le logo est obligatoire." });
    }

    const partenaire = new Partenaire({
      entite,
      information,
      status,
      region,
      partenariat_depuis,
      contact,
      logo: req.file.filename
    });

    await partenaire.save();
    res.status(201).json(partenaire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllPartenaires = async (req, res) => {
  try {
    const partenaires = await paginated(req, res, Partenaire, {}, Partenaire.find().sort({ createdAt: -1 }).lean());
    res.status(200).json(partenaires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllPartenaireActif = async (req, res) => {
  try {
    const partenaires = await paginated(req, res, Partenaire, { status: "Actif" }, Partenaire.find({status: "Actif"}).sort({ createdAt: -1 }).lean());
    res.status(200).json(partenaires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getPartenaireById = async (req, res) => {
  try {
    const partenaire = await Partenaire.findById(req.params.id);
    if (!partenaire) return res.status(404).json({ message: "Partenaire non trouvé." });
    res.status(200).json(partenaire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updatePartenaire = async (req, res) => {
  try {
    const { entite, information, status, region, partenariat_depuis, contact } = req.body;
    const partenaire = await Partenaire.findById(req.params.id);
    if (!partenaire) return res.status(404).json({ message: "Partenaire non trouvé." });

    partenaire.entite = entite || partenaire.entite;
    partenaire.information = information || partenaire.information;
    if (status !== undefined) partenaire.status = status;
    if (region !== undefined) partenaire.region = region;
    if (partenariat_depuis !== undefined) partenaire.partenariat_depuis = partenariat_depuis;
    if (contact !== undefined) partenaire.contact = contact;

    if (req.file) {
      // Supprimer l'ancien logo
      if (partenaire.logo) {
        fs.unlink(path.join('uploads', partenaire.logo), (err) => {});
      }
      partenaire.logo = req.file.filename;
    }

    await partenaire.save();
    res.status(200).json(partenaire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deletePartenaire = async (req, res) => {
  try {
    const partenaire = await Partenaire.findById(req.params.id);
    if (!partenaire) return res.status(404).json({ message: "Partenaire non trouvé." });

    // Supprimer le logo associé
    if (partenaire.logo) {
      fs.unlink(path.join('uploads', partenaire.logo), (err) => {});
    }

    await partenaire.deleteOne();
    res.status(200).json({ message: "Partenaire supprimé." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
