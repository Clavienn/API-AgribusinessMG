import bcrypt from "bcryptjs";
import { paginated } from '../utils/paginate.js';
import jwt from "jsonwebtoken";
import Utilisateur from "../models/User.js"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key agribusiness";


const Inscription = async (req, res) => {

    // console.log(req.body);
    
    try {
        const { nom, tel, email,role,compte, password } = req.body;

        const existingUser = await Utilisateur.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Utilisateur({
            nom,
            tel,
            email,
            role:role || "utilisateur",
            compte:compte || "gratuit",
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "Inscription réussie", user: savedUser });
    } catch (error) {
        console.error("Erreur dans Inscription:", error);
        res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
    }
};


const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Utilisateur.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email non trouvé" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }
        const token = jwt.sign(
            {
                userId: user._id, 
                email: user.email , 
                compte: user.compte, 
                role: user.role 
            },
            JWT_SECRET
        );

        res.status(200).json({ message: "Connexion réussie", token, user });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
    }
};


const GetAllUsers = async (req, res) => {
    try {
        const users = await paginated(req, res, Utilisateur, {}, Utilisateur.find().select('-motDePasse -password').lean());
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error });
    }
};

const GetUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Utilisateur.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error });
    }
};


const UpdatePasswordUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Le mot de passe actuel et le nouveau mot de passe sont requis"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Le nouveau mot de passe doit contenir au moins 6 caractères"
            });
        }

        const user = await Utilisateur.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Le mot de passe actuel est incorrect"
            });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "Le nouveau mot de passe doit être différent de l'ancien"
            });
        }

        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        await Utilisateur.findByIdAndUpdate(
            id,
            { 
                password: hashedNewPassword,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Mot de passe mis à jour avec succès"
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe:', error);
        res.status(500).json({
            success: false,
            message: "Erreur interne du serveur",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


const UpdateUser = async (req, res) => {
    try {
        const { id } = req.params;
        let { nom, email, tel, password, role, adresse, compte } = req.body;

        const updatedData = { nom, email, tel, adresse };

        // Gestion du mot de passe
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        // Gestion des droits admin
        if (req.user.role === 'admin') {
            if (role) updatedData.role = role;

            if (compte) {
                const comptesAutorises = ['gratuit', 'premium', 'entreprise'];
                if (!comptesAutorises.includes(compte)) {
                    return res.status(400).json({ message: "Valeur de compte invalide." });
                }
                updatedData.compte = compte;
            }
        } else {
            if (role || compte) {
                return res.status(403).json({ message: "Vous n'avez pas l'autorisation de modifier ces champs." });
            }
        }

        // Gestion de la photo de profil
        if (req.file) {
            // req.file.filename si tu utilises multer et que tu stockes le nom du fichier
            updatedData.pdp = req.file.filename;
        }

        const updatedUser = await Utilisateur.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json({ message: "Utilisateur mis à jour", user: updatedUser });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({
            message: "Erreur lors de la mise à jour de l'utilisateur",
            error: error.message
        });
    }
};



const DeleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Utilisateur.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        await Utilisateur.findByIdAndDelete(id);

        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
        res.status(500).json({
            message: "Erreur lors de la suppression de l'utilisateur",
            error: error.message
        });
    }
};



export { Inscription, Login, GetAllUsers, DeleteUser , GetUserById, UpdateUser,UpdatePasswordUser };
