import mongoose from 'mongoose';

const AbonneSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: false
  },
  nom: { 
    type: String, 
    required: false, 
    trim: true 
  },
  email: { 
    type: String, 
    required: false, 
    trim: true, 
    lowercase: true,
    unique: true 
  }
}, {
  timestamps: true
});

const Abonne = mongoose.models.Abonne || mongoose.model('Abonne', AbonneSchema);

export default Abonne;
