import express from "express";
const router = express.Router();
import { DeleteUser, GetAllUsers, GetUserById, Inscription, Login, UpdatePasswordUser, UpdateUser } from "../controllers/UserController.js"
import authMiddleware from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import {demandeChangeRole} from "../controllers/RoleRequestController.js"
import upload from "../middlewares/upload.js"



router.post("/register", Inscription);
router.post("/login", Login); 
router.post("/:id/role-request",authMiddleware,demandeChangeRole)

router.get("/",authMiddleware,authorizeRoles('admin'), GetAllUsers)
router.get("/:id",authMiddleware, GetUserById);
router.put("/:id",authMiddleware, upload.single('pdp'), UpdateUser);
router.put("/password/:id",authMiddleware, UpdatePasswordUser);
router.delete("/:id",authMiddleware, authorizeRoles("admin"), DeleteUser)

router.get("/admin-only", authMiddleware, authorizeRoles('admin'), (req, res) => {
    res.json({ message: "Bienvenue Admin !" });
});


export default router;