import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    
    },
    img: {
      type: String, // URL or path for the category image
      required: true,
    }
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` timestamps
);

export default mongoose.model("Categories", CategorySchema);
