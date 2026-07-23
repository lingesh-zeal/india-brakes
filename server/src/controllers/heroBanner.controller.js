import * as HeroBannerService from "../services/heroBanner.service.js";
import { deleteFile } from "../utils/fileCleanup.js";

export const getHeroBanner = async (req, res, next) => {
  try {
    const data = await HeroBannerService.getHeroBanner();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHeroBanner = async (req, res, next) => {
  try {
    const existing = await HeroBannerService.getHeroBanner();

    if(!req.files?.media){
        return res.status(400).json({
            success: false,
            message: "Media file is required",
        });
    }

    const {type, title, subtitle} = req.body;

    if(!["image", "video"].includes(type)){
        return res.status(400).json({
            success: false,
            message: "Type must be image or video",
        });
    }

    const media = req.files.media[0];
    const poster = req.files.poster ? req.files.poster[0] : null;

    const newData = {
      type,

      media_url: `uploads/hero-banner/${media.filename}`,

      poster_url: 
      type === "video" && poster
        ? `uploads/hero-banner/${poster.filename}`
        : null,

      title: title || null,

      subtitle: subtitle || null,
    };

    let result;

    if (existing) {

        const oldmedia = existing.media_url;
        const oldPoster = existing.poster_url;

        result = 
        await HeroBannerService.updateHeroBanner({
            id: existing.id,
            ...newData
        });

      // Delete old media
    if(oldmedia){
        deleteFile(existing.media_url);
    }
      
      // Delete old poster only if new poster uploaded
      if (oldPoster && (poster || type==="image")) {
        deleteFile(oldPoster);
      }

    } else {
      result = await HeroBannerService.createHeroBanner(newData);
    }

    res.status(200).json({
      success: true,
      message: "Hero banner saved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
