import Commande from '../models/Commande.js';
import Produit from '../models/Produit.js';


export const CreateCommande = async (req, res) => {
  try {
    const { totalPrix, detail,adresseLiv, message } = req.body;
    const idClient = req.user.userId;

    if (!detail || detail.length === 0) {
      return res.status(400).json({ message: "La commande doit contenir au moins un produit." });
    }

    const commande = new Commande({
      idClient,
      message: message || '',
      totalPrix,
      adresseLiv,
      detail,
    });

    const savedCommande = await commande.save();
    res.status(201).json({ message: "Commande créée avec succès", commande: savedCommande });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const GetAllCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find().populate('idClient', 'nom tel email').populate('detail.idProduit', 'design');
    res.status(200).json(commandes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const GetCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id).populate('idClient', 'nom email').populate('detail.idProduit', 'design');
    if (!commande) return res.status(404).json({ message: "Commande introuvable" });
    res.status(200).json(commande);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const GetCommandesByVendeur = async (req, res) => {
  try {
    const vendeurId = req.user.userId;
    // console.log(vendeurId);
    
    const produitsVendeur = await Produit.find({ vendeurId: vendeurId }).select('_id');

    if (!produitsVendeur.length) {
      return res.status(404).json({ message: "Aucun produit publié par ce vendeur. " });
    }

    const produitsIds = produitsVendeur.map(p => p._id);

    const commandes = await Commande.find({
      'detail.idProduit': { $in: produitsIds }
    })
      .populate('idClient', 'nom email tel')
      .populate('detail.idProduit', 'design vendeurId');

    res.status(200).json(commandes);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};





export const UpdateCommande = async (req, res) => {

  try {
    const { etat, adresseLiv, detail, totalPrix } = req.body;
    const commandeId = req.params.id;

    const commande = await Commande.findById(commandeId);
    if (!commande) return res.status(404).json({ message: "Commande introuvable" });

    const ancienEtat = commande.etat;
    const ancienDetail = commande.detail;

    // Fonction pour ajuster le stock
    const ajusterStock = async (items, increment = false) => {
      for (const item of items) {
        const produit = await Produit.findById(item.idProduit);
        if (!produit) throw new Error(`Produit avec id ${item.idProduit} introuvable`);
        const changement = increment ? item.quantite : -item.quantite;
        if (!increment && produit.quantite < item.quantite) {
          throw new Error(`Stock insuffisant pour ${produit.design}. Disponible: ${produit.quantite}, demandé: ${item.quantite}`);
        }
        produit.quantite += changement;
        await produit.save();
      }
    };

    // Gestion stock selon changement d'état ou modification de détail
    if (etat === 'Confirmé' && ancienEtat !== 'Confirmé') await ajusterStock(detail || ancienDetail);
    else if (etat === 'Annulé' && ancienEtat === 'Confirmé') await ajusterStock(ancienDetail, true);
    else if (etat === 'Confirmé' && ancienEtat === 'Confirmé' && detail) {
      await ajusterStock(ancienDetail, true); // remettre ancien stock
      try {
        await ajusterStock(detail); // appliquer nouveau stock
      } catch (err) {
        await ajusterStock(ancienDetail, false); // rollback en cas d'erreur
        return res.status(400).json({ message: err.message });
      }
    }

    // Validation simplifiée
    const etatsValides = ['Non confirmé', 'Confirmé', 'En entente', 'Expédiée', 'Livrée', 'Annulé'];
    if (etat && !etatsValides.includes(etat)) return res.status(400).json({ message: `État invalide. Autorisés: ${etatsValides.join(', ')}` });

    if (adresseLiv && (typeof adresseLiv !== 'string' || adresseLiv.trim() === '')) 
      return res.status(400).json({ message: "Adresse de livraison invalide" });

    if (detail) {
      if (!Array.isArray(detail) || detail.length === 0)
        return res.status(400).json({ message: "Les détails doivent être un tableau non vide" });

      for (const item of detail) {
        if (!item.idProduit || !item.quantite || !item.prixUnitaire || !item.designation)
          return res.status(400).json({ message: "Chaque item doit contenir idProduit, quantite, prixUnitaire et designation" });
        if (item.quantite <= 0 || item.prixUnitaire <= 0)
          return res.status(400).json({ message: "Quantité et prix unitaire doivent être > 0" });
      }
    }

    const updateData = {
      ...(etat && { etat }),
      ...(adresseLiv && { adresseLiv: adresseLiv.trim() }),
      ...(detail && { detail }),
      ...(totalPrix !== undefined && { totalPrix }),
    };

    // Recalcul automatique du total si détail modifié
    if (detail) updateData.totalPrix = detail.reduce((sum, item) => sum + item.quantite * item.prixUnitaire, 0);

    const commandeMiseAJour = await Commande.findByIdAndUpdate(
      commandeId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('idClient', 'nom email tel')
     .populate('detail.idProduit', 'design prix');

    if (!commandeMiseAJour) return res.status(404).json({ message: "Erreur mise à jour commande" });

    res.status(200).json({
      message: "Commande mise à jour avec succès",
      commande: commandeMiseAJour,
      modifications: Object.keys(updateData)
    });

  } catch (error) {
    console.error('Erreur UpdateCommande:', error);
    res.status(500).json({ 
      message: "Erreur serveur", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
};





export const DeleteCommande = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) return res.status(404).json({ message: "Commande introuvable" });

    await commande.deleteOne();
    res.status(200).json({ message: "Commande supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
