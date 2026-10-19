import mongoose from 'mongoose';

const InscritFormSchema = new mongoose.Schema(
  {
    idUtilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur',
      required: true,
    },
    idFormation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Formation',
      required: true,
    },
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    dateNaissance: {
      type: Date,
      required: true,
    },
    lieuNaissance: {
      type: String,
      required: true,
      trim: true,
    },
    tel: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    statut: {
      type: String,
      enum: ['en attente', 'confirmée', 'annulée'],
      default: 'en attente',
    },
    note: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const InscritForm =
  mongoose.models.InscritForm || mongoose.model('InscritForm', InscritFormSchema);

export default InscritForm;
