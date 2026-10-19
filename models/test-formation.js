import mongoose from 'mongoose';

const FormationSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    domaine: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    debut: {
      type: Date,
      required: true,
    },
    fin: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          // fin doit être après debut
          return value >= this.debut;
        },
        message: 'La date de fin doit être égale ou postérieure à la date de début.',
      },
    },
    lieu: {
      type: String,
      required: true,
      trim: true,
    },
    niveau: {
      type: String,
      required: true,
      trim: true,
    },
    graphique: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    duree: {
      type: Number, // durée en jours
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

FormationSchema.pre('save', function (next) {
  if (this.debut && this.fin) {
    const diffMs = this.fin.getTime() - this.debut.getTime();
    this.duree = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // conversion ms -> jours
  }
  next();
});

const Formation =
  mongoose.models.Formation || mongoose.model('Formation', FormationSchema);

export default Formation;
