import mongoose from "mongoose";

const ContenuSchema = new mongoose.Schema(
  {
    hero: { type: String, default: "" },
    informer: { type: String, default: "" },
    former: { type: String, default: "" },
    ficheTechnique: { type: String, default: "" },
    annuaire: { type: String, default: "" },
    gerer: { type: String, default: "" },
    acheter: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Contenu || mongoose.model("Contenu", ContenuSchema);
