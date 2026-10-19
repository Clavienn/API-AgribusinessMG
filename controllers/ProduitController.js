import Produit from "../models/Produit.js";
import { paginated } from '../utils/paginate.js';
import path from "path";
import fs from "fs";


export const CreateProduit = async (req, res) => {
  try {
    const { design, description, prix, quantite, categorie, dispo } = req.body;
    const vendeurId = req.user.userId;

    if (!design || !description || !prix || !quantite || !categorie) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Au moins une image est requise." });
    }

    const images = req.files.map(file => file.filename);

    const produit = new Produit({
      vendeurId:vendeurId,
      design,
      description,
      prix,
      quantite,
      categorie,
      images:images,
      dispo: dispo !== undefined ? dispo : true,
      approbation: "non",
    });

    const savedProduit = await produit.save();
    res.status(201).json({ message: "Produit créé avec succès", produit: savedProduit });

  } catch (error) {
    console.error("Erreur lors de la création :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const GetAllProduits = async (req, res) => {
  try {
    const produits = await paginated(req, res, Produit, {}, Produit.find().populate('vendeurId', 'nom email').lean());
    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const GetProduitById = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id).populate('vendeurId', 'nom email');
    if (!produit) return res.status(404).json({ message: "Produit introuvable" });

    res.status(200).json(produit);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const UpdateProduit = async (req, res) => {

  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit introuvable" });

    if (req.user.role !== 'admin' && produit.vendeurId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Action non autorisée" });
    }

    const updateData = req.body;

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.filename);
    }

    const updatedProduit = await Produit.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: "Produit mis à jour", produit: updatedProduit });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const DeleteProduit = async (req, res) => {
  try {

    // console.log(req.params);
    
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit introuvable" });

    if (req.user.role !== 'admin' && produit.vendeurId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Action non autorisée" });
    }

    // Supprimer les fichiers images associés
    produit.images.forEach(image => {
      const filePath = path.join('uploads', image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await produit.deleteOne();
    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
