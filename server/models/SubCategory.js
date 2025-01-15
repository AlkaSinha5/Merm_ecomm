import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String, // URL or path for the subcategory image
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference the Category model
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubCategory", SubCategorySchema);
