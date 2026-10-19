import mongoose from 'mongoose';

const ParcelleSchema = new mongoose.Schema(
  {
    fermeID: { type: mongoose.Schema.Types.ObjectId, ref: 'Ferme', required: true },
    codeP: { type: String, required: true, trim: true },
    nomP: { type: String, required: true, trim: true },
    surfaceP: { type: Number, required: true, min: 0 },
    statut: { type: String, default: "Propriétaire", enum: ['Propriétaire', 'Partagée', 'Louée', 'Echange'], required: true },
    note: { type: String, default: '', trim: true },
    etat: { type: String, default: '', trim: true },
    coordinates: {
      type: {
        type: String,
        enum: ['Polygon'],
        required: true,
        default: 'Polygon'
      },
      coordinates: {
        type: [[[Number]]],
        required: true
      }
    },
  },
  { timestamps: true }
);

ParcelleSchema.index({ fermeID: 1, codeP: 1 }, { unique: true });

const Parcelle = mongoose.models.Parcelle || mongoose.model('Parcelle', ParcelleSchema);

export default Parcelle;
