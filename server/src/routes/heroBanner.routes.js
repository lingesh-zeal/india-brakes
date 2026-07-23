import express from "express";
import {getHeroBanner, updateHeroBanner} from "../controllers/heroBanner.controller.js"
import upload from "../middleware/heroBannerUpload.js";

const router = express.Router();

router.get("/", getHeroBanner);

router.put("/", upload.fields([
    {name: "media", maxCount: 1},
    {name: "poster", maxCount:1}
]),
updateHeroBanner
);

export default router;