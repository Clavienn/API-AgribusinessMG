import mongoose from 'mongoose';

const VisiteurSchema = new mongoose.Schema(
  {
    indicateur: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    adresse: {
      type: String,
      required: true,
      trim: true,
      default: 'Madagascar',
    },
  },
  {
    timestamps: true,
  }
);

const Visiteur =
  mongoose.models.Visiteur || mongoose.model('Visiteur', VisiteurSchema);

export default Visiteur;
