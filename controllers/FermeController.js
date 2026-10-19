import mongoose from "mongoose";
import Ferme from "../models/Ferme.js";
import Parcelle from "../models/Parcelle.js";
import ActiviteAgricole from "../models/ActiviteAgricole.js";


export const GetFermesAvecParcellesEtCultures = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    const fermes = await Ferme.aggregate([
      {
        $match: { userID: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "parcelles",
          localField: "_id",
          foreignField: "fermeID",
          as: "parcelles",
        },
      },
      {
        $unwind: {
          path: "$parcelles",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "activiteagricoles",
          localField: "parcelles._id",
          foreignField: "parcelleID",
          as: "parcelles.activites",
        },
      },
      {
        $group: {
          _id: "$_id",
          codeF: { $first: "$codeF" },
          nomFerme: { $first: "$nomFerme" },
          nomProprietaire: { $first: "$nomProprietaire" },
          type: { $first: "$type" },
          parcelle: { $first: "$parcelle" },
          surface: { $first: "$surface" },
          statut: { $first: "$statut" },
          description: { $first: "$description" },
          note: { $first: "$note" },
          parcelles: {
            $push: {
              _id: "$parcelles._id",
              codeP: "$parcelles.codeP",
              nomParcelle: "$parcelles.nomParcelle",
              superficie: "$parcelles.superficie",
              statut: "$parcelles.statut",
              description: "$parcelles.description",
              note: "$parcelles.note",
              activites: "$parcelles.activites",
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json(fermes);
  } catch (error) {
    console.error("Erreur lors de l'agrégation:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const CreateFerme = async (req, res) => {
  try {
    const { codeF, nomFerme, proprietaire, type,pays,province,ville,codePostal,devise,profitCible } = req.body;
    const userID = req.user.userId;
    if (!codeF || !nomFerme) {
      return res.status(400).json({ message: "CodeF et nomFerme sont obligatoires." });
    }

    const ferme = new Ferme({
      userID,
      codeF,
      nomFerme,
      proprietaire,
      type,
      pays,
      profitCible,
      province,
      ville,
      codePostal,
      devise,
      parcelle: 0,
      surface: 0
    });

    const savedFerme = await ferme.save();
    res.status(201).json({ message: "Ferme créée avec succès", ferme: savedFerme });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Ce codeF existe déjà pour cet utilisateur." });
    }
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const GetAllFermes = async (req, res) => {
  try {
    const fermes = await Ferme.find().sort({ createdAt:-1 });
    res.status(200).json(fermes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const GetAllFermesUser = async (req, res) => {
  try {
    const fermes = await Ferme.find({ userID: req.user.userId });
    res.status(200).json(fermes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const GetFermeById = async (req, res) => {
  try {
    const ferme = await Ferme.findById(req.params.id);
    if (!ferme) return res.status(404).json({ message: "Ferme introuvable" });
    if (ferme.userID.toString() !== req.user.userId)
      return res.status(403).json({ message: "Accès non autorisé" });

    res.status(200).json(ferme);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const UpdateFerme = async (req, res) => {
  try {
    const ferme = await Ferme.findById(req.params.id);
    if (!ferme) return res.status(404).json({ message: "Ferme introuvable" });
    if (ferme.userID.toString() !== req.user.userId)
      return res.status(403).json({ message: "Accès non autorisé" });

    const { codeF, nomFerme, proprietaire, type,profitCible, statut,ville,codePostal, description, note } = req.body;

    
    ferme.codeF = codeF || ferme.codeF;
    ferme.nomFerme = nomFerme || ferme.nomFerme;
    ferme.proprietaire = proprietaire || ferme.proprietaire;
    ferme.type = type || ferme.type;
    ferme.statut = statut || ferme.statut;
    ferme.description = description || ferme.description;
    ferme.note = note || ferme.note;
    ferme.codePostal = codePostal || ferme.codePostal;
    ferme.ville = ville || ferme.ville;
    ferme.profitCible = profitCible || ferme.profitCible;

    const updatedFerme = await ferme.save();
    res.status(200).json({ message: "Ferme mise à jour", ferme: updatedFerme });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Ce codeF existe déjà pour cet utilisateur." });
    }
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const DeleteFerme = async (req, res) => {
  try {
    const ferme = await Ferme.findById(req.params.id);
    if (!ferme) return res.status(404).json({ message: "Ferme introuvable" });
    if (ferme.userID.toString() !== req.user.userId)
      return res.status(403).json({ message: "Accès non autorisé" });

    await ferme.deleteOne();
    res.status(200).json({ message: "Ferme supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
