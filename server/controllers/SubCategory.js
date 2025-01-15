import express from "express";
import SubCategory from "../models/SubCategory.js";
import Category from "../models/Category.js";

const router = express.Router();

// Add SubCategory
export const addSubCategorys = async (req, res) => {
  const { name, img, categoryId } = req.body;

  try {
    // Validate that the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Create a new subcategory
    const subCategory = new SubCategory({
      name,
      img,
      categoryId,
    });

    // Save subcategory to the database
    const savedSubCategory = await subCategory.save();
    return res
      .status(201)
      .json({ message: "SubCategory created successfully", data: savedSubCategory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create subcategory" });
  }
};

export const getSubCategorys = async (req, res, next) => {
    try {
      // Fetch all categories from the database
      const subcategories = await SubCategory.find();
  
      // If no categories are found
      if (subcategories.length === 0) {
        return res.status(404).json({ message: "No subcategories found" });
      }
  
      // Return the categories in the response
      return res.status(200).json({ message: "SubCategories retrieved successfully", subcategories });
    } catch (err) {
      console.error("Error while fetching subcategories:", err);
      return res.status(500).json({ message: "Internal server error", error: err.message });
    }
  };


