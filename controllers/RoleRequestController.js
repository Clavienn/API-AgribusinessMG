import User from '../models/User.js'
import { paginated } from '../utils/paginate.js';
import RoleRequest from '../models/RoleRequest.js'

// Créer une demande de changement de rôle
const demandeChangeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { requestedRole, reason } = req.body;

    if (!requestedRole || !reason) {
      return res.status(400).json({
        success: false,
        message: "Le rôle demandé et la raison sont requis"
      });
    }

    if (reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "La raison doit contenir au moins 10 caractères"
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    if (user.role === requestedRole) {
      return res.status(400).json({
        success: false,
        message: "Vous avez déjà ce rôle"
      });
    }

    const allowedRoles = ['admin', 'manager', 'supervisor', 'formateur', 'vendeur(se)', 'utilisateur'];
    if (!allowedRoles.includes(requestedRole)) {
      return res.status(400).json({
        success: false,
        message: "Rôle demandé non valide"
      });
    }

    const existingRequest = await RoleRequest.findOne({
      userId: id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Vous avez déjà une demande en cours"
      });
    }

    const roleRequest = new RoleRequest({
      userId: id,
      currentRole: user.role,
      requestedRole: requestedRole,
      reason: reason.trim(),
      status: 'pending',
      requestDate: new Date(),
      userInfo: {
        name: user.nom || user.fullName,
        email: user.email
      }
    });

    await roleRequest.save();

    res.status(201).json({
      success: true,
      message: "Demande envoyée avec succès",
      data: roleRequest
    });

  } catch (error) {
    console.error('Erreur demande changement rôle:', error);
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur"
    });
  }
};



const listRoleRequests = async (req, res) => {
  try {
    const requests = await paginated(req, res, RoleRequest, {}, RoleRequest.find().populate("userId", "nom email role").sort({ requestDate: -1 }).lean());

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error("Erreur list demandes:", error); // 👈 log complet
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
      error: error.message
    });
  }
};



export { demandeChangeRole, listRoleRequests };
