import Charge from '../models/Charge.js'
import { paginated } from '../utils/paginate.js';
import Ferme from '../models/Ferme.js';
import Parcelle from '../models/Parcelle.js';
import ActiviteAgricole from '../models/ActiviteAgricole.js';


export const createCharge = async (req, res) => {

    // console.log(req.body);
    
  try {
    const {
      parcelle,
      typeCharge,
      designation,
      effectif,
      prixUnitaire,
      culture,
      note,
    } = req.body

    const nouvelleCharge = new Charge({
      parcelle,
      typeCharge,
      designation,
      effectif,
      prixUnitaire,
      culture,
      note,
    })

    const chargeSauvegardee = await nouvelleCharge.save()
    res.status(201).json(chargeSauvegardee)
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création', error })
  }
}

export const getAllCharges = async (req, res) => {
  try {
    const charges = await paginated(req, res, Charge, {}, Charge.find().populate('parcelle').populate('culture').lean());
    res.status(200).json(charges)
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error })
  }
}

export const getChargeById = async (req, res) => {
  try {
    const charge = await Charge.findById(req.params.id)
      .populate('parcelle')
      .populate('culture')

    if (!charge) return res.status(404).json({ message: 'Charge non trouvée' })

    res.status(200).json(charge)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}

// ✅ Mettre à jour une charge
export const updateCharge = async (req, res) => {
  try {
    const updatedCharge = await Charge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedCharge)
      return res.status(404).json({ message: 'Charge non trouvée' })

    res.status(200).json(updatedCharge)
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error })
  }
}


export const deleteCharge = async (req, res) => {
  try {
    const deleted = await Charge.findByIdAndDelete(req.params.id)

    if (!deleted)
      return res.status(404).json({ message: 'Charge non trouvée' })

    res.status(200).json({ message: 'Charge supprimée avec succès' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error })
  }
}


export const getChargeByUser = async (req, res) => {

    // console.log("User ID : ");
    
  try {
    const userId = req.user.userId
    if (!userId) return res.status(401).json({ message: 'Utilisateur non authentifié' })
    
    // 1. Récupérer les fermes de l'utilisateur
    const fermes = await Ferme.find({ userID: userId }).select('_id')
    const fermeIDs = fermes.map((f) => f._id)
    if (fermeIDs.length === 0) return res.json([])
    
    // 2. Récupérer les parcelles liées à ces fermes
    const parcelles = await Parcelle.find({ fermeID: { $in: fermeIDs } }).select('_id')
    const parcelleIDs = parcelles.map((p) => p._id)
    if (parcelleIDs.length === 0) return res.json([])
    
    // 3. Récupérer les charges liées aux parcelles
    const charges = await paginated(req, res, Charge, { parcelle: { $in: parcelleIDs } }, Charge.find({ parcelle: { $in: parcelleIDs } }).populate('parcelle', 'nomP codeP surfaceP').populate('culture', 'nom type').sort({ createdAt: -1 }).lean());
        console.log('Charges trouvées:', charges); // Debug
    res.status(200).json(charges)
  } catch (error) {
    console.error('Erreur getChargeByUser :', error)
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message,
      details: error.stack 
    })
  }
}