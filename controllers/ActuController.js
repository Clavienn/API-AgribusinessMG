import Actualite from "../models/Actualite.js";


const CreateActualite = async (req, res) => {
  try {
    const { theme, titre, description, source } = req.body;
    const image = req.file?.filename;

    if (!theme || !titre || !description || !source || !image) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    const actualite = new Actualite({
      theme,
      titre,
      description,
      source,
      image,
      approbation: 'non'
    });

    const savedActualite = await actualite.save();
    res.status(201).json({ message: "Actualité créée avec succès", actualite: savedActualite });
  } catch (error) {
    console.error("Erreur lors de la création de l'actualité :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const GetAllActualites = async (req, res) => {
  try {
    const actualites = await Actualite.find().sort({ createdAt: -1 });
    res.status(200).json(actualites);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des actualités", error: error.message });
  }
};

const GetAllActualiteApproved = async (req, res) => {
  try {
    // On récupère toutes les actualités avec approbation "oui", triées par date de création décroissante
    const actualites = await Actualite.find({ approbation: "oui" }).sort({ createdAt: -1 });

    // Si aucune actualité n'est trouvée, renvoyer un tableau vide (optionnel)
    res.status(200).json(actualites);
  } catch (error) {
    // On renvoie un message clair + l'erreur réelle
    res.status(500).json({
      message: "Erreur lors de la récupération des actualités approuvées",
      error: error.message,
    });
  }
};



const GetActualiteById = async (req, res) => {
  try {
    const { id } = req.params;
    const actualite = await Actualite.findById(id);

    if (!actualite) {
      return res.status(404).json({ message: "Actualité non trouvée" });
    }

    res.status(200).json(actualite);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'actualité", error: error.message });
  }
};

const UpdateActualite = async (req, res) => {
  try {
    const { id } = req.params;
    const { theme, titre, description, source, approbation } = req.body;
    const image = req.file?.filename; 

    const updateFields = {};
    if (theme) updateFields.theme = theme;
    if (titre) updateFields.titre = titre;
    if (description) updateFields.description = description;
    if (source) updateFields.source = source;
    if (approbation) updateFields.approbation = approbation;
    if (image) updateFields.image = image;

    if (approbation !== undefined && !['oui', 'non'].includes(approbation)) {
      return res.status(400).json({ message: "Valeur de l'approbation invalide. Utilisez 'oui' ou 'non'." });
    }

    const updatedActualite = await Actualite.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedActualite) {
      return res.status(404).json({ message: "Actualité non trouvée" });
    }

    res.status(200).json({ message: "Actualité mise à jour avec succès", actualite: updatedActualite });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

const DeleteActualite = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedActualite = await Actualite.findByIdAndDelete(id);

    if (!deletedActualite) {
      return res.status(404).json({ message: "Actualité non trouvée" });
    }

    res.status(200).json({ message: "Actualité supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

export {
  CreateActualite,
  GetAllActualites,
  GetActualiteById,
  GetAllActualiteApproved,
  UpdateActualite,
  DeleteActualite
};
