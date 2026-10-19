import mongoose from 'mongoose'

const ResultatCultureSchema = new mongoose.Schema(
  {
    parcelle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parcelle',
      required: true,
    },
    culture: {
      type: String,
      trim: true,
      required: true,
    },
    Qteresultat: {
      type: Number,
      required: true,
    },
    PrixUvente: { 
      type: Number,
      required: true,
    },
    Unite: {
      type: String,
      default: 'kg',
    },
    DateRecolte: {
      type: Date,
      required: true,
    },
    Qualite: {
      type: String,
      enum: ['Premium', 'Standard', 'Inférieur'],
    },
    Remarques: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.ResultatCulture || mongoose.model('ResultatCulture', ResultatCultureSchema)
