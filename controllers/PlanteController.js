import Plante from "../models/Plante.js";


export const createPlante = async (req, res) => {
  try {
    const { numero, description } = req.body;

    const imageUrl = req.file.filename
    const plante = new Plante({ numero, description, imageUrl });
    await plante.save();

    res.status(201).json({ success: true, data: plante });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const getPlantes = async (req, res) => {
  try {
    const plantes = await Plante.find();
    res.status(200).json({ success: true, data: plantes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Récupérer une plante par ID
export const getPlanteById = async (req, res) => {
  try {
    const plante = await Plante.findById(req.params.id);
    if (!plante) {
      return res.status(404).json({ success: false, message: "Plante non trouvée" });
    }
    res.status(200).json({ success: true, data: plante });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Mettre à jour une plante
export const updatePlante = async (req, res) => {
  try {
    const { numero, description } = req.body;
    const updateData = { numero, description };

    if (req.file) {
      updateData.imageUrl = req.file.filename;
    }

    const plante = await Plante.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!plante) {
      return res.status(404).json({ success: false, message: "Plante non trouvée" });
    }

    res.status(200).json({ success: true, data: plante });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// ✅ Supprimer une plante
export const deletePlante = async (req, res) => {
  try {
    const plante = await Plante.findByIdAndDelete(req.params.id);
    if (!plante) {
      return res.status(404).json({ success: false, message: "Plante non trouvée" });
    }
    res.status(200).json({ success: true, message: "Plante supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
