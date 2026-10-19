import express from "express"
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectMongo from "./utils/db.js";
import user from "./routes/user.js"
import actualite from './routes/actualite.js'
import formation from './routes/formation.js'
import inscritform from './routes/inscritform.js'
import produit from './routes/produit.js'
import commande from './routes/commande.js'
import ferme from './routes/ferme.js'
import parcelle from './routes/parcelle.js'
import agricole from './routes/agricole.js'
import abonne from './routes/abonne.js'
import partenaire from './routes/partenaire.js'
import path from "path"
import Intrant from "./routes/intrant.js";
import Traitement from "./routes/traitement.js";
import rapport from "./routes/rapport.js";
import charge from "./routes/charge.js"
import fiche from "./routes/fiche.js"
import resultatReel from "./routes/resultReel.js"
import excel from "./routes/excel.js"
import role from "./routes/rolerequest.js"
import annuaire from "./routes/annuaire.js"
import plante from "./routes/plante.js"
import contenu from "./routes/contenu.js"

import stock from "./routes/stock.js"


connectMongo()
const app = express()
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


app.get("/",(req,res)=>
{
    res.send("Bienvenue sur api agribusiness.mg ")
})


app.use("/api/user",user)
app.use("/api/actualite",actualite)
app.use("/api/formation",formation)
app.use("/api/inscrit",inscritform)
app.use("/api/produit",produit)
app.use("/api/commande",commande)
app.use("/api/ferme",ferme)
app.use("/api/parcelle",parcelle)
app.use("/api/agricole",agricole)
app.use("/api/abonnement",abonne)
app.use("/api/partenaire",partenaire)
app.use("/api/intrant",Intrant)

app.use("/api/intrant-stock",stock)
app.use("/api/traitement",Traitement)
app.use("/api/rapport",rapport)
app.use("/api/charge",charge)
app.use('/api/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use("/api/fiches",fiche)
app.use("/api/resultat",resultatReel)
app.use("/api/excel",excel)
app.use("/api/role-request",role)
app.use("/api",annuaire)
app.use("/api/plante",plante)
app.use("/api/contenus",contenu)


app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});


app.listen(PORT, console.log(`Server running sur le port ${PORT}...`))