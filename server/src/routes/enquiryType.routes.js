import express from "express";
import { 
    addEnquiryType, 
    removeEnquiryType, 
    editEnquiryType,
    fetchEnquiryTypes } 
from "../controllers/enquiryType.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", fetchEnquiryTypes);
router.post("/", authenticate, addEnquiryType);
router.put("/:id", authenticate, editEnquiryType);
router.delete("/:id", authenticate, removeEnquiryType);


export default router;