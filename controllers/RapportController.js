import Parcelle from '../models/Parcelle.js';
import StockIntrant from '../models/IntrantStock.js';
import Intrant from '../models/Intrant.js';

import Traitement from '../models/Traitement.js';
import Culture from '../models/ActiviteAgricole.js';

export const getRapportParParcelle = async (req, res) => {
  const { fermeID } = req.params;

  try {
    // 1. Récupérer toutes les parcelles de la ferme
    const parcelles = await Parcelle.find({ fermeID });

    const rapport = await Promise.all(
      parcelles.map(async (parcelle) => {
        // 2. Récupérer les stocks d'intrants avec toutes les infos intrant
        const intrants = await StockIntrant.find({ parcelle: parcelle._id })
          .populate('parcelle', 'nomP surfaceP codeP') // infos parcelle
          .populate('intrant'); // toutes les infos du modèle Intrant

        // 3. Récupérer les traitements liés à cette parcelle
        const traitements = await Traitement.find({ parcelle: parcelle._id })
          .populate('produit', 'nom type'); // infos produit utilisé
        // 4. Récupérer les cultures liées à cette parcelle
        const cultures = await Culture.find({ idParcelle: parcelle._id });

        return {
          parcelle,
          intrants,
          traitements,
          cultures
        };
      })
    );

    return res.status(200).json(rapport);

  } catch (error) {
    console.error("Erreur lors de la génération du rapport :", error);
    return res.status(500).json({ message: "Erreur serveur lors du chargement du rapport." });
  }
};
