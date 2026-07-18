import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import upload from "../middleware/welcomeUpload.js";
import { addCarouselImage, deleteCarouselImage, getWelcome, updateCarouselImage, updateWelcome } from "../controllers/welcome.controller.js";

const router = express.Router();

router.get("/", getWelcome);

//ADMIN

router.put(
    "/admin", authenticate, updateWelcome
);

router.post(
    "/admin/carousel",
    authenticate, 
    upload.single("image"),
    addCarouselImage
);

router.put(
    "/admin/carousel/:id",
    authenticate, 
    upload.single("image"),
    updateCarouselImage
);

router.delete(
    "/admin/carousel/:id", authenticate, deleteCarouselImage
);

export default router;