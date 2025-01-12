import mongoose from "mongoose";
import Products from "../models/Products.js";
import { createError } from "../error.js";
import { v2 as cloudinary } from "cloudinary";


// Configure Cloudinary
cloudinary.config({
  cloud_name: "dhzk0ztrn",
  api_key: "571339484391153",
  api_secret: "WWmOJpVF5y02r7Blu2oAr0RxbU0",
});

export const addProducts = async (req, res, next) => {
  try {
    const productData = req.body;
    console.log(req.body); // Log the incoming product data

    // Destructure the fields from the product data
    const { title, name, desc, img, price, sizes, category } = productData;

    // Validate required fields for the product
    if (!title || !name || !desc || !price) {
      return res.status(400).json({ message: "All fields are required for the product" });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(img, {
      folder: "products", // Specify the folder in Cloudinary
    });

    // Create and save the new product
    const product = new Products({
      title,
      name,
      desc,
      img: uploadedImage.secure_url, // Use the uploaded image URL
      price,
      sizes,
      category,
    });

    try {
      const createdProduct = await product.save();
      return res.status(201).json({ message: "Product created successfully", product: createdProduct });
    } catch (err) {
      // Handle error during the save operation
      return res.status(500).json({
        message: "Failed to save the product",
        error: err.message,
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


export const updateProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = req.body; // The updated product data from the request body
    const { img } = updatedData;

    // Validate the product ID
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Find the existing product
    const existingProduct = await Products.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle image upload if a new image is provided
    if (img) {
      try {
        const uploadedImage = await cloudinary.uploader.upload(img, {
          folder: "products", // Specify the folder in Cloudinary
        });

        // Update the `img` field with the new uploaded image URL
        updatedData.img = uploadedImage.secure_url;
      } catch (error) {
        return res.status(500).json({
          message: "Failed to upload the image to Cloudinary",
          error: error.message,
        });
      }
    }

    // Update the product in the database
    const updatedProduct = await Products.findByIdAndUpdate(productId, updatedData, {
      new: true, // Return the updated product after the update
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const getproducts = async (req, res, next) => {
  try {
    let { categories, minPrice, maxPrice, sizes, search } = req.query;
    sizes = sizes?.split(",");
    categories = categories?.split(",");

    const filter = {};

    if (categories && Array.isArray(categories)) {
      filter.category = { $in: categories }; // Match products in any of the specified categories
    }

    if (minPrice || maxPrice) {
      filter["price.org"] = {};
      if (minPrice) {
        filter["price.org"]["$gte"] = parseFloat(minPrice);
      }
      if (maxPrice) {
        filter["price.org"]["$lte"] = parseFloat(maxPrice);
      }
    }

    if (sizes && Array.isArray(sizes)) {
      filter.sizes = { $in: sizes }; // Match products in any of the specified sizes
    }

    if (search) {
      filter.$or = [
        { title: { $regex: new RegExp(search, "i") } }, // Case-insensitive title search
        { desc: { $regex: new RegExp(search, "i") } }, // Case-insensitive description search
      ];
    }

    const products = await Products.find(filter);
    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const deleteProducts = async(req,res)=>{
  try {
    const productId = req.params.id;
    
    // Find and delete the product
    const deletedProduct = await Products.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: 'Server error' });
  }

}

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      // return next(createError(400, "Invalid product ID"));
      return res.status(400).json({ message: "Invalid product6 ID" });
    }
    const product = await Products.findById(id);
    if (!product) {
      // return next(createError(404, "Product not found"));
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};
