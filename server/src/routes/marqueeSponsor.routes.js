import express from "express";

import {
    getActiveSponsors,
    getAllSponsors,
    createSponsor,
    updateSponsor,
    toggleSponsor,
    deleteSponsor
} from "../controllers/marqueeSponsor.controller.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { marqueeSponsorUpload } from "../middleware/marqueeSponsorUpload.js";

const router = express.Router();

//Public
router.get("/", getActiveSponsors);

router.get(
    "/admin",
    authenticate,
    getAllSponsors
)

// Admin
router.post(
    "/admin",
    authenticate,
    marqueeSponsorUpload.single("image"),
    createSponsor
);

router.put(
    "/admin/:id",
    authenticate,
    marqueeSponsorUpload.single("image"),
    updateSponsor
);

router.patch(
    "/admin/:id/toggle",
    authenticate,
    toggleSponsor
);

router.delete(
    "/admin/:id",
    authenticate,
    deleteSponsor
)

export default router;
