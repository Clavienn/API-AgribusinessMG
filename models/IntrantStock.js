import mongoose from 'mongoose';

const StockIntrantSchema = new mongoose.Schema({
  parcelle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parcelle',
    required: true
  },
  intrant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Intrant',
    required: true
  },
  prixUnitaire: { type: Number, required: true, min: 0 },
  quantiteTotale: { type: Number, required: true, min: 0 },
  quantiteUtilisee: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

export default mongoose.model('StockIntrant', StockIntrantSchema);
