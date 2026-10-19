import mongoose from 'mongoose';

const FermeSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    codeF: { type: String, required: true, trim: true },
    nomFerme: { type: String, required: true, trim: true },
    proprietaire: { type: String, default: "Non défini", required: true, trim: true },
    type: { type: String, default: "Non défini", required: true },
    pays: { type: String, default: "Madagascar", required: true },
    province: { type: String, default: "Non défini", required: true },
    ville: { type: String, default: "Non défini", required: true },
    codePostal: { type: String, default: "Non défini", required: true },
    profitCible: { type: String, default: 0, required: true },
    device: { type: String, default: "MGA", required: true },
    parcelle: { type: Number, default: 0, required: true, min: 0 },
    surface: { type: Number, default: 0, required: true, min: 0 }, 
    statut: { type: String, default: "activé", required: true, enum: ['activé', 'désactivé', 'en attente'] },
  },
  { timestamps: true }
);

FermeSchema.index({ userID: 1, codeF: 1 }, { unique: true });

const Ferme = mongoose.models.Ferme || mongoose.model('Ferme', FermeSchema);

export default Ferme;
