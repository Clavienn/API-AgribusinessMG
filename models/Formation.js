import mongoose from 'mongoose';

const FormationSchema = new mongoose.Schema(
  {
    id_formateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur',
      required: true,
    },
    titre: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    categorie: {
      type: String,
      trim: true,
      default: '',
      enum: ['Importation', 'Exportation', 'Agriculture',"Fruit"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    lieu: {
      type: String,
      required: true,
      trim: true,
    },
    prix: {
      type: Number,
      required: true,
    },
    niveau: {
      type: String,
      required: true,
      trim: true,
      enum: ['débutant', 'intermédiaire', 'avancé'],
    },
    graphique: {
      type: String,
      trim: true,
      default: '',
    },
    duree: {
      type: Number,
      required: true,
      min: 0,
    },
    dateFormation: {
      type: Date,
      required: true,
    },
    approbation: {
      type: String,
      default:"Non",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

FormationSchema.index({ id_formateur: 1 });

const Formation = mongoose.models.Formation || mongoose.model('Formation', FormationSchema);
export default Formation;
