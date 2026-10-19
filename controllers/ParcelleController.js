import Parcelle from '../models/Parcelle.js';
import Ferme from '../models/Ferme.js';



export const createParcelle = async (req, res) => {

  console.log("Creating parcelle with data:", req.body);
  
  try {
    const { ferme, codeP, nomP, surfaceP, statut, note,etat  } = req.body;
    const fermes = await Ferme.findById(ferme);
    if (!fermes) {
      return res.status(404).json({ message: 'Ferme non trouvée' });
    }

    const parcelle = await Parcelle.create({
      fermeID:ferme,
      codeP,
      nomP,
      surfaceP,
      statut,
      note,
      etat,
        coordinates: {
        type: "Polygon",
        coordinates: req.body.coordonates, // pas de double tableau ici
  }
    });

    fermes.parcelle += 1;
    fermes.surface += surfaceP;
    await fermes.save();

    res.status(201).json(parcelle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création de la parcelle', error: err.message });
  }
};

export const getAllParcelles = async (req, res) => {
  try {
    const parcelles = await Parcelle.find().populate('fermeID');
    res.status(200).json(parcelles);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des parcelles', error: err.message });
  }
};


export const getParcellesForCurrentUser = async (req, res) => {
  try {

    const fermes = await Ferme.find({ userID: req.user.userId });
    if (!fermes.length) {
      return res.status(404).json({ message: 'Aucune ferme trouvée pour cet utilisateur.' });
    }
    const fermeIDs = fermes.map(ferme => ferme._id);
    const parcelles = await Parcelle.find({ fermeID: { $in: fermeIDs } }).populate('fermeID');

    return res.status(200).json(parcelles);
  } catch (err) {
    console.error('Erreur getParcellesForCurrentUser:', err);
    return res.status(500).json({
      message: "Erreur lors de la récupération des parcelles de l'utilisateur connecté",
      error: err.message,
    });
  }
};

export const getParcelleById = async (req, res) => {
  try {
    const parcelle = await Parcelle.findById(req.params.id).populate('fermeID');
    if (!parcelle) {
      return res.status(404).json({ message: 'Parcelle non trouvée' });
    }
    res.status(200).json(parcelle);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la parcelle', error: err.message });
  }
};

export const getParcelleByFermeId = async (req, res) => {
  try {
    const { fermeID } = req.params;
    const parcelles = await Parcelle.find({ fermeID }).populate('fermeID');

    if (!parcelles || parcelles.length === 0) {
      return res.status(404).json({ message: 'Aucune parcelle trouvée pour cette ferme' });
    }

    res.status(200).json(parcelles);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des parcelles par ferme', error: err.message });
  }
};

export const updateParcelle = async (req, res) => {
  try {
    const { superficie: newSuperficie, ...updateFields } = req.body;

    const parcelle = await Parcelle.findById(req.params.id);
    if (!parcelle) {
      return res.status(404).json({ message: 'Parcelle non trouvée' });
    }

    if (newSuperficie != null && newSuperficie !== parcelle.superficie) {
      const ferme = await Ferme.findById(parcelle.fermeID);
      ferme.surface = ferme.surface - parcelle.superficie + newSuperficie;
      await ferme.save();
      parcelle.superficie = newSuperficie;
    }
    Object.assign(parcelle, updateFields);
    await parcelle.save();

    res.status(200).json(parcelle);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err.message });
  }
};


export const deleteParcelle = async (req, res) => {
  try {
    const parcelle = await Parcelle.findById(req.params.id);
    if (!parcelle) {
      return res.status(404).json({ message: 'Parcelle non trouvée' });
    }

    const ferme = await Ferme.findById(parcelle.fermeID);
    ferme.parcelle -= 1;
    ferme.surface -= parcelle.superficie;
    await ferme.save();

    await parcelle.deleteOne();

    res.status(200).json({ message: 'Parcelle supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: err.message });
  }
};
