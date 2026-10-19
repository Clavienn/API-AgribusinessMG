import Formation from "../models/Formation.js";


export const CreateFormation = async (req, res) => {
  try {
    const { titre, domaine, description, lieu, niveau,categorie, duree,prix, dateFormation } = req.body;
    const id_formateur = req.user.userId;

    if (!titre || !description || !lieu || !niveau || !duree || !dateFormation) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    const formation = new Formation({
      id_formateur,
      titre,
      domaine,
      description,
      categorie,
      lieu,
      niveau,
      duree,
      prix,
      dateFormation,
      graphique: req.file?.filename || "",
    });

    const savedFormation = await formation.save();
    res.status(201).json({ message: "Formation créée avec succès", formation: savedFormation });

  } catch (error) {
    console.error("Erreur lors de la création :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const GetAllFormations = async (req, res) => {
  try {
    const formations = await Formation.find().populate('id_formateur', 'nom email');
    res.status(200).json(formations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const GetFormationById = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id).populate('id_formateur', 'nom email');
    if (!formation) return res.status(404).json({ message: "Formation introuvable" });

    res.status(200).json(formation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const UpdateFormation = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).json({ message: "Formation introuvable" });

    // Autorisation
    if (req.user.role !== 'admin' && formation.id_formateur.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Action non autorisée" });
    }

    const updateData = req.body;
    if (req.file?.filename) {
      updateData.graphique = req.file.filename;
    }

    const updatedFormation = await Formation.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: "Formation mise à jour", formation: updatedFormation });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const DeleteFormation = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).json({ message: "Formation introuvable" });

    if (req.user.role !== 'admin' && formation.id_formateur.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Action non autorisée" });
    }

    await formation.deleteOne();
    res.status(200).json({ message: "Formation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
