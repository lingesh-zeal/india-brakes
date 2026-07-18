import fs from "fs";
import path from "path";
import * as WelcomeService from "../services/welcome.service.js";

export const getWelcome = async (req, res, next) => {
  try {
    const data = await WelcomeService.getWelcome();
    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const updateWelcome = async (req, res, next) => {
  try {
    const data = await WelcomeService.updateSection(req.body);
    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const addCarouselImage = async (req, res, next) => {
  try {
    const total = await WelcomeService.countImages();

    if (total >= 6) {
      return res.status(400).json({
        success: false,
        message: "Maximum 6 images are allowed.",
      });
    }

    if(!req.file){
      return res.status(400).json({
        success: false,
        message: "Image is required."
      });
    }

    const data = await WelcomeService.addImage({
      image: req.file.filename,
      alt_tag: req.body.alt_tag,
    });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCarouselImage = async (req, res, next) => {
  try {
    const existing = await WelcomeService.getImage(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }
    let image = existing.image;

    if (req.file) {
      const oldPath = path.join(process.cwd(), "uploads", existing.image);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      image = `carousel/${req.file.filename}`;
    }

    const updatedData = await WelcomeService.updateImage(
      req.params.id, 
      {
        image,
        alt_tag: req.body.alt_tag ?? existing.alt_tag,
      }
    );

    res.json({
      success: true,
      message: "Carousel image updated successfully",
      data: updatedData,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCarouselImage = async (req, res, next) => {
  try {

    const total = await WelcomeService.countImages();
    if(total <=1){
      return res.status(400).json({
        success: false,
        message: "At least one image must exist in carousel."
      })
    }
    const image = await WelcomeService.getImage(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    //Delete file form uploads folder

    const imagePath = path.join(process.cwd(), "uploads", image.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete DB record
    await WelcomeService.deleteImage(req.params.id);
    res.json({
      success: true,
      message: "Carousel Image deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
