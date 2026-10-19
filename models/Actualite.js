import mongoose from 'mongoose';

const ActualiteSchema = new mongoose.Schema(
  {
    theme: {
      type: String,
      required: true,
      trim: true,
    },
    titre: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    source: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^https?:\/\/.+/, 'URL de source invalide'],
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    approbation: {
      type: String,
      enum: ['non', 'oui'],
      default: 'non',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Actualite = mongoose.models.Actualite || mongoose.model('Actualite', ActualiteSchema);

export default Actualite;
