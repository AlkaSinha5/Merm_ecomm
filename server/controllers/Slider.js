import { v2 as cloudinary } from "cloudinary";
import Slider from "../models/Slider.js";
import mongoose from "mongoose";

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dhzk0ztrn",
  api_key: "571339484391153",
  api_secret: "WWmOJpVF5y02r7Blu2oAr0RxbU0",
});

export const addSliders = async (req, res, next) => {
  try {
    // Log the incoming Slider data
    // console.log("Incoming slider data:", req.body);
    
    const sliderData = req.body;
    const {  img } = sliderData;

    // Validate required fields for the Slider
    if (!img) {
      return res.status(400).json({ message: "All fields are required for the Slider" });
    }

    // Check if the database connection is open
    // console.log("Database Connection:", mongoose.connection.readyState);

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(img, {
      folder: "Sliders", // Specify the folder in Cloudinary
    });

    // console.log("Uploaded Image URL:", uploadedImage.secure_url); // Log the image URL after upload

    // Create and save the new Slider
    const slider = new Slider({
      img: uploadedImage.secure_url, // Use the uploaded image URL
    });

    // console.log("Slider object:", slider); // Log the slider before saving

    try {
      const createdSlider = await slider.save();
    //   console.log("Created Slider:", createdSlider); // Log the saved slider

      return res.status(201).json({ message: "Slider created successfully", Slider: createdSlider });
    } catch (err) {
      // Log full error if saving the slider fails
    //   console.error("Error while saving slider:", err);
      return res.status(500).json({
        message: "Failed to save the Slider",
        error: err.message,
      });
    }
  } catch (err) {
    // Log any other errors
    // console.error("Internal server error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const getSliders = async (req, res, next) => {
    try {
      // Fetch all sliders from the database
      const sliders = await Slider.find();
  
      // If no sliders are found
      if (sliders.length === 0) {
        return res.status(404).json({ message: "No sliders found" });
      }
  
      // Return the sliders in the response
      return res.status(200).json({ message: "Sliders retrieved successfully", sliders });
    } catch (err) {
    //   console.error("Error while fetching sliders:", err);
      return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

export const deleteSlider = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find the slider in the database
    const slider = await Slider.findById(id);

    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }

    // Extract the public ID of the image from the Cloudinary URL
    const publicId = slider.img.split("/").pop().split(".")[0];

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete the slider from the database
    await Slider.findByIdAndDelete(id);

    return res.status(200).json({ message: "Slider deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
