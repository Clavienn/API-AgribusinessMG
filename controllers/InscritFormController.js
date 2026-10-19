import InscritForm from "../models/InscritFormation.js";
import { paginated } from '../utils/paginate.js';
import Formation from "../models/Formation.js";
import { Parser as Json2csvParser } from 'json2csv';
import excelJS from 'exceljs';

export const InscriptionFormation = async (req, res) => {
  
  try {
    const { formationId, dateNaissance,telephone,email,nomComplet, lieuNaissance, note } = req.body;
    const idUtilisateur = req.user.userId;
    
    if (!formationId || !nomComplet || !dateNaissance || !lieuNaissance) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée." });
    }

    const exist = await InscritForm.findOne({ idUtilisateur, formationId });
    if (exist) {
      return res.status(400).json({ message: "Vous êtes déjà inscrit à cette formation." });
    }

    const inscription = new InscritForm({
      idUtilisateur,
      idFormation:formationId,
      dateNaissance,
      nom:nomComplet,
      tel:telephone,
      email:email,
      lieuNaissance,
      note: note ? note.trim() : ""
    });

    const savedInscription = await inscription.save();

    res.status(201).json({ message: "Inscription réussie", inscription: savedInscription });
  } catch (error) {
    console.error("Erreur inscription formation:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const GetAllInscritFormations = async (req, res) => {
  try {
    const inscritformations = await paginated(req, res, InscritForm, {}, InscritForm.find().populate('idFormation').populate('idUtilisateur', 'nom email tel').lean());

    res.status(200).json(inscritformations);
  } catch (error) {
    console.error("Erreur getAllInscritFormations:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const GetInscritsForFormateur = async (req, res) => {
  try {
    const idFormateur = req.user.userId;
    const formations = await Formation.find({ id_formateur: idFormateur });
    const formationIds = formations.map(f => f._id);

    const inscriptions = await paginated(req, res, InscritForm, { idFormation: { $in: formationIds } }, InscritForm.find({ idFormation: { $in: formationIds } }).populate('idUtilisateur', 'nom email tel').populate('idFormation', 'titre dateFormation').lean());

    res.status(200).json(inscriptions);
  } catch (error) {
    console.error("Erreur lors de la récupération des inscriptions du formateur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const UpdateStatutInscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const validStatuts = ['en attente', 'confirmée', 'annulée'];
    if (!validStatuts.includes(statut)) {
      return res.status(400).json({ message: "Statut invalide." });
    }

    const updated = await InscritForm.findByIdAndUpdate(
      id,
      { statut },
      { new: true }
    )
      .populate('idFormation')
      .populate('idUtilisateur', 'nom email tel');

    if (!updated) {
      return res.status(404).json({ message: "Inscription non trouvée." });
    }

    res.status(200).json({ message: "Statut mis à jour", inscription: updated });
  } catch (error) {
    console.error("Erreur maj statut:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer inscriptions filtrées selon query et rôle
export const getInscriptions = async (req, res) => {
  try {
    const { statut, idFormation, idUtilisateur, fromDate, toDate } = req.query;
    const query = {};

    if (statut) query.statut = statut;
    if (idFormation) query.idFormation = idFormation;
    if (idUtilisateur) query.idUtilisateur = idUtilisateur;
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    if (req.user.role === 'formateur') {
      const formations = await Formation.find({ id_formateur: req.user._id }).select('_id');
      const formationIds = formations.map(f => f._id.toString());
      query.idFormation = { $in: formationIds };
    }

    const inscriptions = await paginated(req, res, InscritForm, query, InscritForm.find(query).populate('idUtilisateur', 'nom email compte role').populate('idFormation', 'titre dateFormation domaine').sort({ createdAt: -1 }).lean());

    res.status(200).json(inscriptions);
  } catch (error) {
    console.error("Erreur getInscriptions :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Export CSV
export const exportInscriptionsCSV = async (req, res) => {
  try {
    const inscriptions = await getInscriptionsDataForExport(req.user);

    if (inscriptions.length === 0) {
      return res.status(404).json({ message: "Aucune inscription à exporter." });
    }

    const csvData = inscriptions.map(i => ({
      utilisateur: i.idUtilisateur.nom,
      email: i.idUtilisateur.email,
      compte: i.idUtilisateur.compte,
      role: i.idUtilisateur.role,
      formation: i.idFormation.titre,
      domaine: i.idFormation.domaine,
      dateFormation: i.idFormation.dateFormation.toISOString().slice(0, 10),
      statut: i.statut,
      dateInscription: i.createdAt.toISOString().slice(0, 10),
    }));

    const fields = Object.keys(csvData[0]);
    const json2csvParser = new Json2csvParser({ fields });
    const csv = json2csvParser.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment('inscriptions.csv');
    return res.send(csv);
  } catch (error) {
    console.error("Erreur export CSV :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Export Excel
export const exportInscriptionsExcel = async (req, res) => {
  try {
    const inscriptions = await getInscriptionsDataForExport(req.user);

    if (inscriptions.length === 0) {
      return res.status(404).json({ message: "Aucune inscription à exporter." });
    }

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inscriptions");

    worksheet.columns = [
      { header: "Utilisateur", key: "utilisateur", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Compte", key: "compte", width: 15 },
      { header: "Role", key: "role", width: 15 },
      { header: "Formation", key: "formation", width: 30 },
      { header: "Domaine", key: "domaine", width: 20 },
      { header: "Date Formation", key: "dateFormation", width: 15 },
      { header: "Statut", key: "statut", width: 15 },
      { header: "Date Inscription", key: "dateInscription", width: 15 },
    ];

    inscriptions.forEach(i => {
      worksheet.addRow({
        utilisateur: i.idUtilisateur.nom,
        email: i.idUtilisateur.email,
        compte: i.idUtilisateur.compte,
        role: i.idUtilisateur.role,
        formation: i.idFormation.titre,
        domaine: i.idFormation.domaine,
        dateFormation: i.idFormation.dateFormation.toISOString().slice(0, 10),
        statut: i.statut,
        dateInscription: i.createdAt.toISOString().slice(0, 10),
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=inscriptions.xlsx"
    );

    await workbook.xlsx.write(res);
    res.status(200).end();

  } catch (error) {
    console.error("Erreur export Excel :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Helper interne pour export et filtrage selon rôle
const getInscriptionsDataForExport = async (user) => {
  let query = {};

  if (user.role === 'formateur') {
    const formations = await Formation.find({ id_formateur: user._id }).select('_id');
    const formationIds = formations.map(f => f._id.toString());
    query.idFormation = { $in: formationIds };
  }

  return await InscritForm.find(query)
    .populate('idUtilisateur', 'nom email compte role')
    .populate('idFormation', 'titre dateFormation domaine');
};

// Statistiques simples d'inscriptions
export const getStatsInscriptions = async (req, res) => {
  try {
    const groupPipeline = [
      {
        $group: {
          _id: {
            formation: "$idFormation",
            statut: "$statut"
          },
          count: { $sum: 1 }
        }
      }
    ];

    let matchPipeline = {};
    if (req.user.role === 'formateur') {
      const formations = await Formation.find({ id_formateur: req.user._id }).select('_id');
      const formationIds = formations.map(f => f._id);
      matchPipeline = { idFormation: { $in: formationIds } };
    }

    const stats = await InscritForm.aggregate([
      { $match: matchPipeline },
      ...groupPipeline
    ]);

    res.status(200).json(stats);
  } catch (error) {
    console.error("Erreur statistiques inscriptions :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
