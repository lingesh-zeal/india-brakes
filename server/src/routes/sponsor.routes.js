import express from "express";
import { changeSponsorStatus, fetchSponsorInquiries, submitSponsorInquiry,editSponsorInquiry } from "../controllers/sponsor.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

//PUBLIC
router.post("/", submitSponsorInquiry);

//ADMIN
router.get("/", authenticate, fetchSponsorInquiries);
router.patch("/:id/status", authenticate, changeSponsorStatus);
router.patch("/:id", authenticate,editSponsorInquiry)

export default router;
