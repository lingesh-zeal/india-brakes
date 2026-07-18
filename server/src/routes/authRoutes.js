import express from "express";
import { loginAdmin, me } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

//Protected Route
router.get("/me", authenticate, me)
export default router;