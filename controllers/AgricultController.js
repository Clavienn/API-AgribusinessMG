import ActiviteAgricole from '../models/ActiviteAgricole.js';
import Parcelle from '../models/Parcelle.js';
import Ferme from '../models/Ferme.js';


export const createActivite = async (req, res) => {
  try {
    const data = req.body;
    // console.log("Data received for new activity:", data);
    
    const nouvelleActivite = new ActiviteAgricole(data);
    const saved = await nouvelleActivite.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Erreur création activité agricole:", error);
    res.status(500).json({ error: "Erreur serveur lors de la création" });
  }
};

export const getAllActivites = async (req, res) => {
  try {
    const activites = await ActiviteAgricole.find()
      .populate('idParcelle')
      .sort({ createdAt: -1 });

    res.status(200).json(activites);
  } catch (error) {
    console.error("Erreur récupération activités:", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération" });
  }
};

export const getActivitesByUser = async (req, res) => {
  
  try {
    const fermeIDs = (await Ferme.find({ userID: req.user.userId })
      .select('_id')
      .lean())
      .map(f => f._id);
      
    if (fermeIDs.length === 0) return res.json([]);

    const parcelleIDs = (await Parcelle.find({ fermeID: { $in: fermeIDs } })
      .select('_id')
      .lean())
      .map(p => p._id);

    if (parcelleIDs.length === 0) return res.json([]);

    const cultures = await ActiviteAgricole.find({ idParcelle: { $in: parcelleIDs } })
      .populate('idParcelle', 'nomP codeP surfaceP')
      .sort({ dateSemis: -1 });

    return res.json(cultures);

  } catch (error) {
    console.error("Erreur lors de la récupération des cultures par utilisateur:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};


export const getActiviteById = async (req, res) => {
  try {
    const { id } = req.params;
    const activite = await ActiviteAgricole.findById(id).populate('parcelleID');
    if (!activite) {
      return res.status(404).json({ error: "Activité agricole non trouvée" });
    }
    res.status(200).json(activite);
  } catch (error) {
    console.error("Erreur récupération activité par ID:", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération" });
  }
};

export const updateActivite = async (req, res) => {
  try {
    const { id } = req.params;
    const dataUpdate = req.body;

    const activiteUpdated = await ActiviteAgricole.findByIdAndUpdate(id, dataUpdate, {
      new: true,
      runValidators: true
    });

    if (!activiteUpdated) {
      return res.status(404).json({ error: "Activité agricole non trouvée" });
    }

    res.status(200).json(activiteUpdated);
  } catch (error) {
    console.error("Erreur mise à jour activité:", error);
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour" });
  }
};

export const deleteActivite = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ActiviteAgricole.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Activité agricole non trouvée" });
    }

    res.status(200).json({ message: "Activité agricole supprimée avec succès" });
  } catch (error) {
    console.error("Erreur suppression activité:", error);
    res.status(500).json({ error: "Erreur serveur lors de la suppression" });
  }
};
