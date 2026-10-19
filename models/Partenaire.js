import mongoose from 'mongoose';

const PartenaireSchema = new mongoose.Schema(
  {
    entite: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    information: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    logo: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Actif', 'En attente', 'Inactif'],
      default: 'Actif',
    },
    region: {
      type: String,
      trim: true,
      default: '',
    },
    partenariat_depuis: {
      type: String,
      trim: true,
      default: '',
    },
    contact: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Partenaire = mongoose.models.Partenaire || mongoose.model('Partenaire', PartenaireSchema);

export default Partenaire;
