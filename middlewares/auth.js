import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key agribusiness";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("AUTH HEADER:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Aucun token reçu ou mal formé");
    return res.status(401).json({ message: "Accès non autorisé - token manquant" });
  }

  const token = authHeader.split(" ")[1];
  // console.log("TOKEN REÇU:", token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log("✅ TOKEN DÉCODÉ AVEC SUCCÈS:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Erreur de vérification du token:", error.message);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

export default authMiddleware;
