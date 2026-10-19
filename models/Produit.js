import mongoose from 'mongoose';

const ProduitSchema = new mongoose.Schema(
  {
    vendeurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur',
      required: true,
    },
    design: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    prix: {
      type: Number,
      required: true,
      min: 0,
    },
    quantite: {
      type: Number,
      required: true,
      min: 0,
    },
    categorie: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      required: true,
      default: [],
    },
    dispo: {
      type: Boolean,
      required: true,
      default: true,
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

ProduitSchema.index({ vendeurId: 1 });

const Produit =
  mongoose.models.Produit || mongoose.model('Produit', ProduitSchema);

export default Produit;
