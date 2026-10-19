import mongoose from 'mongoose';

const DetailCommandeSchema = new mongoose.Schema({
  idProduit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit',
    required: true,
  },
  designation: {
    type: String,
    trim: true,
    default: '',
  },
  quantite: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  prixUnitaire: {
    type: Number,
    required: true,
    min: 0,
  },
  prixTotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

const CommandeSchema = new mongoose.Schema(
  {
    idClient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur',
      required: true,
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    adresseLiv: {
      type: String,
      trim: true,
      default: '',
    },
    totalPrix: {
      type: Number,
      required: true,
      min: 0,
    },
    detail: {
      type: [DetailCommandeSchema],
      required: true,
      validate: [arrayLimit, '{PATH} ne peut pas être vide'],
    },
    etat: {
      type: String,
      enum: ['Non confirmé', 'Confirmé', 'En entente', 'Expédié', 'Livré', 'Annulé'],
      default: 'Non confirmé',
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length > 0;
}

const Commande = mongoose.models.Commande || mongoose.model('Commande', CommandeSchema);
export default Commande;
