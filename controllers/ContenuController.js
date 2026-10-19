import Contenu from "../models/Contenu.js";


export const getContenus = async (req, res) => {
  try {
    let contenu = await Contenu.findOne();
    if (!contenu) {
      contenu = await Contenu.create({});
    }

    res.status(200).json(contenu);
  } catch (error) {
    console.error("Erreur getContenus:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};




export const updateContenuSection = async (req, res) => {
  try {
    const { section } = req.params; 
    const { content } = req.body;

    const allowedSections = [
      "hero",
      "informer",
      "former",
      "ficheTechnique",
      "annuaire",
      "gerer",
      "acheter",
    ];

    if (!allowedSections.includes(section)) {
      return res.status(400).json({ message: `Section '${section}' invalide` });
    }

    let contenu = await Contenu.findOne();
    if (!contenu) {
      contenu = await Contenu.create({});
    }

    contenu[section] = content;
    await contenu.save();

    res.status(200).json({
      message: `Section '${section}' mise à jour avec succès`,
      contenu,
    });
  } catch (error) {
    console.error("Erreur updateContenuSection:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
