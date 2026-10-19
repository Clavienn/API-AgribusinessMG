import Abonne from '../models/Abonner.js';
import Utilisateur from '../models/User.js';

export const createAbonne = async (req, res) => {
  try {
    const { nom, email } = req.body;
    const idUser = req.user?.userId;
    if (idUser) {
      const user = await Utilisateur.findById(idUser);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const abonne = new Abonne({
        idUser: user._id,
        nom: user.nom,
        email: user.email
      });

      const saved = await abonne.save();
      return res.status(201).json(saved);
    } 
    else {
      const abonne = new Abonne({ nom, email });
      const saved = await abonne.save();
      return res.status(201).json(saved);
    }

  } catch (error) {
    console.error('Erreur création abonné:', error);
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }
    res.status(500).json({ error: 'Erreur serveur lors de la création' });
  }
}



export const getAllAbonnes = async (req, res) => {
  try {
    const abonnes = await Abonne.find().sort({ createdAt: -1 });
    res.status(200).json(abonnes);
  } catch (error) {
    console.error('Erreur récupération abonnés:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération' });
  }
};


export const getAbonneById = async (req, res) => {
  try {
    const { id } = req.params;
    const abonne = await Abonne.findById(id).populate('idUser', 'nom email');
    if (!abonne) {
      return res.status(404).json({ error: 'Abonné non trouvé' });
    }
    res.status(200).json(abonne);
  } catch (error) {
    console.error('Erreur récupération abonné:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération' });
  }
};


export const deleteAbonne = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Abonne.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Abonné non trouvé' });
    }
    res.status(200).json({ message: 'Abonné supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression abonné:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression' });
  }
};
