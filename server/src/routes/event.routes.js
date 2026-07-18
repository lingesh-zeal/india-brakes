import express from "express";

import {
    getEvents, getEventById,getAllSponsors,
    createEvent, updateEvent, deleteEvent, 
    updateEventStatus, archiveEvent, restoreEvent
} from "../controllers/event.controller.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.middleware.js";


const router = express.Router();

// EVENT ROUTES

// GET all events
router.get("/", getEvents);

//GET All Sponsors 
router.get("/sponsors", getAllSponsors);

// GET event by ID
router.get("/:id", getEventById);



// CREATE FULL EVENT (SPEAKERS + SPONSORS + PHOTOS)
router.post(
  "/",
  authenticate,
  upload.fields([
    { name: "banner", maxCount: 1 },
    {name: "brochure", maxCount: 2},
    { name: "photos", maxCount: 20 },
    { name: "speaker_images", maxCount: 20 },
    { name: "sponsor_logos", maxCount: 20 },
  ]),
  createEvent
);

//Update routes
router.put(
  "/:id",
  authenticate,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "brochure", maxCount: 2 },
    { name: "photos", maxCount: 20 },
    { name: "speaker_images", maxCount: 20 },
    { name: "sponsor_logos", maxCount: 20 },
  ]),
  updateEvent
);

// Update status route
router.patch("/:id/status", authenticate, updateEventStatus);

//Archive
router.patch("/:id/archive", authenticate, archiveEvent);

//Restore
router.patch("/:id/restore", authenticate, restoreEvent);

//DELETE routes
router.delete("/:id", authenticate, deleteEvent);

export default router;
