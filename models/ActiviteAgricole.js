import mongoose from 'mongoose';

// Schéma pour les cultures
const cultureSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la culture est requis'],
    trim: true,
    maxLength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
  },
  type: {
    type: String,
    required: [true, 'Le type de culture est requis'],
    enum: ['Céréale', 'Légume', 'Fruit', 'Épice', 'Boisson', 'Légumineuse', 'Tubercule', 'Plante aromatique', 'Autre'],
  },
  cycle: {
    type: String,
    required: [true, 'Le cycle de culture est requis'],
    enum: ['Annuel', 'Pérenne', 'Bisannuel', 'Saisonnier'],
  },
  idParcelle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parcelle',
    required: [true, 'La parcelle est requise'],
  },
  dateSemis: {
    type: Date,
    required: [true, 'La date de semis est requise'],
  },
  dureeMaturationMin: {
    type: Number,
    min: [0, 'La durée de maturation minimale doit être positive'],
    validate: {
      validator(value) {
        return !this.dureeMaturationMax || value <= this.dureeMaturationMax;
      },
      message: 'La durée minimale ne peut pas être supérieure à la durée maximale',
    },
  },
  dureeMaturationMax: {
    type: Number,
    min: [0, 'La durée de maturation maximale doit être positive'],
    validate: {
      validator(value) {
        return !this.dureeMaturationMin || value >= this.dureeMaturationMin;
      },
      message: 'La durée maximale ne peut pas être inférieure à la durée minimale',
    },
  },
  rendementEstime: {
    type: Number,
    min: [0, 'Le rendement estimé doit être positif'],
    default: 0,
  },
  rendementReel: {
    type: Number,
    min: [0, 'Le rendement réel doit être positif'],
    default:0
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'La description ne peut pas dépasser 500 caractères'],
  },
  statut: {
    type: String,
    enum: ['Planifié', 'Semé', 'En croissance', 'Prêt à récolter', 'Récolté', 'Terminé'],
    default: 'Planifié',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  dateRecoltePrevisionnelle: {
    type: Date,
    
  },
  dateRecolteReelle: {
    type: Date,
  },
}, {
  timestamps: true,
});




cultureSchema.pre('save', function (next) {
  // Calcul de la date de récolte prévisionnelle
  if (this.dateSemis && this.dureeMaturationMax) {
    const semis = new Date(this.dateSemis);
    const jours = this.dureeMaturationMax * 30; // approximation mois → jours
    this.dateRecoltePrevisionnelle = new Date(semis.getTime() + jours * 24 * 60 * 60 * 1000);
  }

  // Mise à jour du statut automatique
  const today = new Date();
  const dateSemis = new Date(this.dateSemis);

  if (this.dateRecolteReelle) {
    this.statut = 'Récolté';
  } else if (this.dateRecoltePrevisionnelle && today >= this.dateRecoltePrevisionnelle) {
    this.statut = 'Prêt à récolter';
  } else if (today >= dateSemis) {
    this.statut = 'En croissance';
  } else {
    this.statut = 'Planifié';
  }

  next();
});

// ✅ Index
cultureSchema.index({ proprietaire: 1, dateSemis: -1 });
cultureSchema.index({ idParcelle: 1, isActive: 1 });
cultureSchema.index({ statut: 1 });

// ✅ Méthodes d'instance
cultureSchema.methods.calculerRendementParHectare = function (superficieParcelle) {
  if (this.rendementReel && superficieParcelle > 0) {
    return this.rendementReel / superficieParcelle;
  }
  return 0;
};

cultureSchema.methods.estEnRetard = function () {
  const today = new Date();
  return this.dateRecoltePrevisionnelle && today > this.dateRecoltePrevisionnelle && !this.dateRecolteReelle;
};

// ✅ Méthode statique
cultureSchema.statics.parStatut = function (statut, proprietaire) {
  return this.find({ statut, proprietaire, isActive: true })
    .populate('idParcelle', 'nomP superficie')
    .sort({ dateSemis: -1 });
};

const Culture = mongoose.model('Culture', cultureSchema);

export default Culture;
