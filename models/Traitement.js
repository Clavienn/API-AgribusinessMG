// models/Traitement.js
import mongoose from 'mongoose'

const traitementSchema = new mongoose.Schema({
  typeTraitement: {
    type: String,
    required: true,
  },
  parcelle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parcelle',
    required: true,
  },
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StockIntrant',
    required: true,
  },
  dose: {
    type: Number,
    required: true,
  },
  datePrevue: {
    type: Date,
    required: true,
  },
  heurePrevue: {
    type: String,
    required: true,
  },
  meteo: {
    type: String,
    required: true,
  },
  frequence: {
    type: String,
    default: 'Unique',
  },
  priorite: {
    type: String,
    enum: ['Faible', 'Normal', 'Élevé', 'Urgent'],
    default: 'Normal',
  },
  objectif: {
    type: String,
    trim: true,
  },
  materiel: {
    type: String,
    trim: true,
  },
  precautions: {
    type: String,
    trim: true,
  }
},
{
    timestamps: true,
});


traitementSchema.index({ parcelle: 1 });

export default mongoose.model('Traitement', traitementSchema);
