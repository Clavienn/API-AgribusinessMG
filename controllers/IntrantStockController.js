import StockIntrant from "../models/IntrantStock.js";
import { paginated } from '../utils/paginate.js';
import Parcelle from "../models/Parcelle.js";
import Ferme from "../models/Ferme.js";
import Intrant from '../models/Intrant.js';

// Créer un nouveau stock d'intrant
export const createStockIntrant = async (req, res) => {
  try {
    const { parcelle, intrant, prixUnitaire, quantiteTotale } = req.body;

    const newStock = new StockIntrant({
      parcelle,
      intrant,
      prixUnitaire,
      quantiteTotale
    });

    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (error) {
    console.error("Erreur lors de la création du stock :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupérer tous les stocks d'intrants
export const getAllStockIntrants = async (req, res) => {
  try {
    const stocks = await paginated(req, res, StockIntrant, {}, StockIntrant.find().populate('parcelle').populate('intrant').lean());
    res.status(200).json(stocks);
  } catch (error) {
    console.error("Erreur lors de la récupération des stocks :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupérer un stock par ID
export const getStockIntrantById = async (req, res) => {
  try {
    const stock = await StockIntrant.findById(req.params.id)
      .populate('parcelle')
      .populate('intrant');

    if (!stock) return res.status(404).json({ message: "Stock intrant non trouvé" });

    res.status(200).json(stock);
  } catch (error) {
    console.error("Erreur lors de la récupération du stock :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const getStockIntrantByUser = async (req, res) => {
  try {
    // 1. Récupérer les fermes de l'utilisateur connecté
    const fermeIDs = (await Ferme.find({ userID: req.user.userId }).select('_id')).map(f => f._id);
    if (fermeIDs.length === 0) return res.json([]);

    // 2. Récupérer les parcelles liées à ces fermes
    const parcelleIDs = (await Parcelle.find({ fermeID: { $in: fermeIDs } }).select('_id')).map(p => p._id);
    if (parcelleIDs.length === 0) return res.json([]);

    // 3. Récupérer les stocks liés aux parcelles trouvées
    const stocks = await paginated(req, res, StockIntrant, { parcelle: { $in: parcelleIDs } }, StockIntrant.find({ parcelle: { $in: parcelleIDs } }).populate('parcelle', 'nomP surfaceP').populate('intrant', 'nom type categorie description unite prixUnitaire fournisseur composition').sort({ createdAt: -1 }).lean());

    res.json(stocks);
  } catch (error) {
    console.error("Erreur récupération du stock intrant par user :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



// Mettre à jour un stock d'intrant
export const updateStockIntrant = async (req, res) => {
  try {
    const updatedStock = await StockIntrant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStock) return res.status(404).json({ message: "Stock intrant non trouvé" });

    res.status(200).json(updatedStock);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du stock :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Supprimer un stock d'intrant
export const deleteStockIntrant = async (req, res) => {
  try {
    const deletedStock = await StockIntrant.findByIdAndDelete(req.params.id);

    if (!deletedStock) return res.status(404).json({ message: "Stock intrant non trouvé" });

    res.status(200).json({ message: "Stock intrant supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du stock :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
