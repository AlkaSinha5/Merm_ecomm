import { v2 as cloudinary } from "cloudinary";
import Category from "../models/Category.js";
import mongoose from "mongoose";

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dhzk0ztrn",
  api_key: "571339484391153",
  api_secret: "WWmOJpVF5y02r7Blu2oAr0RxbU0",
});

export const addCategorys = async (req, res, next) => {
  try {
    // Log the incoming Category data
    console.log("Incoming category data:", req.body);
    
    const CategoryData = req.body;
    const { name, img } = CategoryData;

    // Validate required fields for the Category
    if (!name || !img) {
      return res.status(400).json({ message: "All fields are required for the Category" });
    }

    // Check if the database connection is open
    console.log("Database Connection:", mongoose.connection.readyState);

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(img, {
      folder: "Categorys", // Specify the folder in Cloudinary
    });

    console.log("Uploaded Image URL:", uploadedImage.secure_url); // Log the image URL after upload

    // Create and save the new Category
    const category = new Category({
      name,
      img: uploadedImage.secure_url, // Use the uploaded image URL
    });

    console.log("Category object:", category); // Log the category before saving

    try {
      const createdCategory = await category.save();
      console.log("Created Category:", createdCategory); // Log the saved category

      return res.status(201).json({ message: "Category created successfully", Category: createdCategory });
    } catch (err) {
      // Log full error if saving the category fails
      console.error("Error while saving category:", err);
      return res.status(500).json({
        message: "Failed to save the Category",
        error: err.message,
      });
    }
  } catch (err) {
    // Log any other errors
    console.error("Internal server error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
export const getCategorys = async (req, res, next) => {
    try {
      // Fetch all categories from the database
      const categories = await Category.find();
  
      // If no categories are found
      if (categories.length === 0) {
        return res.status(404).json({ message: "No categories found" });
      }
  
      // Return the categories in the response
      return res.status(200).json({ message: "Categories retrieved successfully", categories });
    } catch (err) {
      console.error("Error while fetching categories:", err);
      return res.status(500).json({ message: "Internal server error", error: err.message });
    }
  };
