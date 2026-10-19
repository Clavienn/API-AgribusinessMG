import ResultatCulture from '../models/Resultat.js';
import Ferme from '../models/Ferme.js';
import Parcelle from '../models/Parcelle.js';

// 📌 Créer un résultat de culture
export const createResultatCulture = async (req, res) => {
  try {
    const resultat = new ResultatCulture(req.body);
    await resultat.save();
    res.status(201).json(resultat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📌 Obtenir tous les résultats de culture
export const getResultatsCulture = async (req, res) => {
  try {
    const resultats = await ResultatCulture.find()
      .populate('idParcelle', 'nomP codeP surfaceP')
      .sort({ createdAt: -1 });
    res.status(200).json(resultats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Obtenir les résultats d’un utilisateur
export const getResultByUser = async (req, res) => {
  try {
    const fermeIDs = (
      await Ferme.find({ userID: req.user.userId })
        .select('_id')
        .lean()
    ).map(f => f._id);

    if (fermeIDs.length === 0) return res.json([]);

    const parcelleIDs = (
      await Parcelle.find({ fermeID: { $in: fermeIDs } })
        .select('_id')
        .lean()
    ).map(p => p._id);

    if (parcelleIDs.length === 0) return res.json([]);

    const resultats = await ResultatCulture.find({ parcelle: { $in: parcelleIDs } })
      .populate('parcelle', 'nomP codeP surfaceP')
      .sort({ dateSemis: -1 });

    return res.json(resultats);
  } catch (error) {
    console.error("Erreur lors de la récupération des résultats par utilisateur:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📌 Obtenir un résultat par ID
export const getResultatCultureById = async (req, res) => {
  try {
    const resultat = await ResultatCulture.findById(req.params.id)
      .populate('idParcelle', 'nomP codeP surfaceP');

    if (!resultat) {
      return res.status(404).json({ message: 'Résultat non trouvé' });
    }

    res.status(200).json(resultat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Mettre à jour un résultat
export const updateResultatCulture = async (req, res) => {
  try {
    const resultat = await ResultatCulture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resultat) {
      return res.status(404).json({ message: 'Résultat non trouvé' });
    }

    res.status(200).json(resultat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📌 Supprimer un résultat
export const deleteResultatCulture = async (req, res) => {
  try {
    const resultat = await ResultatCulture.findByIdAndDelete(req.params.id);

    if (!resultat) {
      return res.status(404).json({ message: 'Résultat non trouvé' });
    }

    res.status(200).json({ message: 'Résultat supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
