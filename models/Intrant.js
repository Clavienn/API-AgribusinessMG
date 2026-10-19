import mongoose from 'mongoose';

const IntrantSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  type: { type: String, required: true },
  categorie: { type: String, required: true },
  description: { type: String, trim: true },
  unite: { type: String, required: true },
  prixUnitaire: { type: Number, required: true, min: 0 },
  fournisseur: { type: String, trim: true },
  composition: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('Intrant', IntrantSchema);
