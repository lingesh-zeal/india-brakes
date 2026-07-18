import express from "express";

import { getEventRegistrations, registerForEvent } from "../controllers/registration.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerForEvent);
router.get(  "/registrations/events/:id",
    authenticate,
    getEventRegistrations)
export default router;