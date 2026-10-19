import Traitement from '../models/Traitement.js'
import Ferme from '../models/Ferme.js'
import Parcelle from '../models/Parcelle.js'
import StockIntrant from '../models/IntrantStock.js';




export const createTraitement = async (req, res) => {
  const data = req.body;

  try {
    // 1. Validation de la dose
    const dose = Number(data.dose);
    if (isNaN(dose) || dose <= 0) {
      return res.status(400).json({ message: "La dose doit être un nombre positif." });
    }

    // 2. Vérifier et mettre à jour le stock intrant
    const stock = await StockIntrant.findById(data.produit);
    if (!stock) {
      return res.status(404).json({ message: "Stock intrant introuvable." });
    }

    // Vérifier si la dose ne dépasse pas le stock disponible
    if (stock.quantiteUtilisee + dose > stock.quantiteTotale) {
      return res.status(400).json({ message: "La dose dépasse le stock disponible." });
    }

    stock.quantiteUtilisee += dose;
    await stock.save();

    // 3. Créer et sauvegarder le traitement
    const traitement = new Traitement({ ...data, dose });
    const savedTraitement = await traitement.save();

    // 4. Retourner le traitement + le stock mis à jour
    res.status(201).json({
      traitement: savedTraitement,
      stock: stock
    });

  } catch (error) {
    console.error("Erreur création traitement :", error);
    res.status(500).json({ message: error.message });
  }
};

// Lister tous les traitements
export const getAllTraitements = async (req, res) => {
  try {
    const traitements = await Traitement.find()
      .populate('parcelle')
      .populate('produit');
    res.status(200).json(traitements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un traitement par ID
export const getTraitementById = async (req, res) => {
  try {
    const traitement = await Traitement.findById(req.params.id)
      .populate('parcelle')
      .populate('produit');
    if (!traitement) return res.status(404).json({ message: 'Non trouvé' });
    res.json(traitement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un traitement
export const updateTraitement = async (req, res) => {
  try {
    const traitement = await Traitement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!traitement) return res.status(404).json({ message: 'Non trouvé' });
    res.json(traitement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un traitement
export const deleteTraitement = async (req, res) => {
  try {
    const traitement = await Traitement.findByIdAndDelete(req.params.id);
    if (!traitement) return res.status(404).json({ message: 'Non trouvé' });
    res.json({ message: 'Traitement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getTraitementsByUser = async (req, res) => {
  try {

    const fermeIDs = (await Ferme.find({ userID: req.user.userId }).select('_id')).map(f => f._id);
    if (fermeIDs.length === 0) return res.json([]);

    // 2. Trouver les parcelles liées à ces fermes
    const parcelleIDs = (await Parcelle.find({ fermeID: { $in: fermeIDs } }).select('_id')).map(p => p._id);
    if (parcelleIDs.length === 0) return res.json([]);

    const traitements = await Traitement.find({ parcelle: { $in: parcelleIDs } })
      .populate('parcelle', 'nomP codeP')
      .populate('produit', 'nom type')
      .sort({ createdAt: -1 });

    return res.json(traitements);
  } catch (error) {
    console.error("Erreur récupération des traitements par user :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
