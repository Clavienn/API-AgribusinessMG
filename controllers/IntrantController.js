import Intrant from '../models/Intrant.js';
import { paginated } from '../utils/paginate.js';
import Ferme from '../models/Ferme.js';
import Parcelle from '../models/Parcelle.js';

export const createIntrant = async (req, res) => {

  // console.log("Requête reçue pour créer un intrant :", req.body);
  
  try {
    const newIntrant = new Intrant(req.body);
    const saved = await newIntrant.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Erreur lors de la création de l'intrant :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getAllIntrants = async (req, res) => {
  try {
    const intrants = await paginated(req, res, Intrant, {}, Intrant.find({}).lean());
    res.json(intrants);
  } catch (error) {
    console.error("Erreur récupération de tous les intrants :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// export const getAllIntrants = async (req, res) => {
//   try {
//     const intrants = await Intrant.find().populate('idParcelle', 'nomP codeP');
//     res.json(intrants);
//   } catch (error) {
//     console.error("Erreur récupération de tous les intrants :", error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };

export const getIntrantById = async (req, res) => {
  try {
    const intrant = await Intrant.findById(req.params.id).populate('idParcelle', 'nomP codeP');
    if (!intrant) return res.status(404).json({ message: 'Intrant non trouvé' });
    res.json(intrant);
  } catch (error) {
    console.error("Erreur récupération intrant par ID :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateIntrant = async (req, res) => {
  console.log("Requête reçue pour mettre à jour l'intrant :", req.body);
  
  try {
    const updated = await Intrant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Intrant non trouvé' });
    res.json(updated);
  } catch (error) {
    console.error("Erreur mise à jour intrant :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteIntrant = async (req, res) => {
  try {
    const deleted = await Intrant.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Intrant non trouvé' });
    res.json({ message: 'Intrant supprimé' });
  } catch (error) {
    console.error("Erreur suppression intrant :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getIntrantsByUser = async (req, res) => {
  try {

    const fermeIDs = (await Ferme.find({ userID: req.user.userId }).select('_id')).map(f => f._id);
    if (fermeIDs.length === 0) return res.json([]);

    // 2. Trouver les parcelles liées à ces fermes
    const parcelleIDs = (await Parcelle.find({ fermeID: { $in: fermeIDs } }).select('_id')).map(p => p._id);
    if (parcelleIDs.length === 0) return res.json([]);

    // 3. Trouver les intrants liés à ces parcelles
    const intrants = await paginated(req, res, Intrant, { idParcelle: { $in: parcelleIDs } }, Intrant.find({ idParcelle: { $in: parcelleIDs } }).populate('idParcelle', 'nomP codeP surfaceP').sort({ createdAt: -1 }).lean());

    res.json(intrants);
  } catch (error) {
    console.error("Erreur récupération des intrants par user :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
