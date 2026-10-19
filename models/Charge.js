import mongoose from 'mongoose'

const ChargeSchema = new mongoose.Schema(
  {
    parcelle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parcelle',
      required: true,
    },
    typeCharge: {
      type: String,
      enum: ['mo', 'machine'],
      required: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    effectif: {
      type: Number,
      required: true,
      min: 1,
    },
    prixUnitaire: {
      type: Number,
      required: true,
      min: 0,
    },
    culture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Culture',
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Charge || mongoose.model('Charge', ChargeSchema)
