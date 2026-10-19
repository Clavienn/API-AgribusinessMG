import mongoose from 'mongoose';

const UtilisateurSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      lowercase: true,
    },
    tel: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['utilisateur', 'formateur', 'vendeur(se)' , 'admin'],
      default: 'utilisateur',
      required: true,
    },
    pdp: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    compte: {
      type: String,
      enum: ['gratuit', 'premium', 'entreprise'],
      default: 'gratuit',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Utilisateur = mongoose.models.Utilisateur || mongoose.model('Utilisateur', UtilisateurSchema);

export default Utilisateur;
