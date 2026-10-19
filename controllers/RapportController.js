import Parcelle from '../models/Parcelle.js';
import StockIntrant from '../models/IntrantStock.js';

import Traitement from '../models/Traitement.js';
import Culture from '../models/ActiviteAgricole.js';

const groupBy = (docs, key) => {
  const map = new Map();
  for (const d of docs) {
    const k = String(d[key]?._id ?? d[key]);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(d);
  }
  return map;
};

export const getRapportParParcelle = async (req, res) => {
  const { fermeID } = req.params;

  try {
    // 1. Récupérer toutes les parcelles de la ferme
    const parcelles = await Parcelle.find({ fermeID }).lean();
    const ids = parcelles.map((p) => p._id);

    // 2-4. Une seule requête par collection (au lieu de 3 par parcelle)
    const [intrants, traitements, cultures] = await Promise.all([
      StockIntrant.find({ parcelle: { $in: ids } })
        .populate('parcelle', 'nomP surfaceP codeP')
        .populate('intrant')
        .lean(),
      Traitement.find({ parcelle: { $in: ids } })
        .populate('produit', 'nom type')
        .lean(),
      Culture.find({ idParcelle: { $in: ids } }).lean(),
    ]);

    const intrantsBy = groupBy(intrants, 'parcelle');
    const traitementsBy = groupBy(traitements, 'parcelle');
    const culturesBy = groupBy(cultures, 'idParcelle');

    const rapport = parcelles.map((parcelle) => {
      const k = String(parcelle._id);
      return {
        parcelle,
        intrants: intrantsBy.get(k) || [],
        traitements: traitementsBy.get(k) || [],
        cultures: culturesBy.get(k) || [],
      };
    });

    return res.status(200).json(rapport);

  } catch (error) {
    console.error("Erreur lors de la génération du rapport :", error);
    return res.status(500).json({ message: "Erreur serveur lors du chargement du rapport." });
  }
};
