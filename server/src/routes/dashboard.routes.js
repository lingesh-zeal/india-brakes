import express from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get(
    "/",
    authenticate,
    getDashboardData
);


export default router;