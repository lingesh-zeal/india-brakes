import fs from "fs";
import path from "path";
import * as marqueeService from "../services/marqueeSponsor.service.js";

export const getActiveSponsors = async (req, res) => {
  try {
    const sponsors = await marqueeService.getActiveMarqueeSponsors();

    res.status(200).json({
      success: true,
      count: sponsors.length,
      data: sponsors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sponsors",
    });
  }
};

// ADMIN GET ALL

export const getAllSponsors = async (req, res) => {
  try {
    const sponsors = await marqueeService.getAllMarqueeSponsors();

    res.json({
      success: true,
      count: sponsors.length,
      data: sponsors,
    });
  } catch (error) {
    console.error("Get All Sponsors Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch sponsors",
      error: error.message,
    });
  }
};

// ADMIN CREATE
export const createSponsor = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Sponsor image is required.",
      });
    }
    const sponsor = await marqueeService.createMarqueeSponsor({
      image_url: `uploads/marquee-sponsors/${req.file.filename}`,
      alt_text: req.body.alt_text || null,
      // display_order: req.body.display_order
    });

    res.status(201).json({
      success: true,
      data: sponsor,
    });
  } catch (error) {
    console.error("Create Sponsor Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create sponsor",
    });
  }
};

// ADMIN UPDATE
export const updateSponsor = async (req, res) => {
  try {
    const existingSponsor = await marqueeService.getMarqueeSponsorById(
      req.params.id,
    );

    if (!existingSponsor) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found.",
      });
    }

    if (req.file && existingSponsor.image_url) {
      const oldImage = path.join(
        process.cwd(),
        existingSponsor.image_url.replace(/^\/+/, ""),
      );

      if (fs.existsSync(oldImage)) {
        fs.unlinkSync(oldImage);
      }
    }

    const sponsor = await marqueeService.updateMarqueeSponsor(req.params.id, {
      image_url: req.file
        ? `uploads/marquee-sponsors/${req.file.filename}`
        : null,

      alt_text: req.body.alt_text ?? null,
    });

    res.status(200).json({
      success: true,
      data: sponsor,
    });
  } catch (error) {
    console.error("Update Sponsor Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update sponsor",
    });
  }
};

// ADMIN TOGGLE
export const toggleSponsor = async (req, res) => {
   try {
    const sponsor =
      await marqueeService.toggleMarqueeSponsor(req.params.id);

    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: sponsor,
    });
  } catch (error) {
    console.error("Toggle Sponsor Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to toggle sponsor",
    });
  }
};

// ADMIN DELETE
export const deleteSponsor = async (req, res) => {
  try {
    const existingSponsor =
      await marqueeService.getMarqueeSponsorById(req.params.id);

    if (!existingSponsor) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found.",
      });
    }

    // Delete image from disk
    if (existingSponsor.image_url) {
      const imagePath = path.join(
        process.cwd(),
        existingSponsor.image_url.replace(/^\/+/, "")
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await marqueeService.deleteMarqueeSponsor(req.params.id);

    res.status(200).json({
      success: true,
      message: "Sponsor deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Sponsor Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete sponsor",
    });
  }
};
