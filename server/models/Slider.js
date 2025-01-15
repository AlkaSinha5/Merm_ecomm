import mongoose from "mongoose";

const SliderSchema = new mongoose.Schema(
  {
    img: {
      type: String, // URL or path for the Slider image
      required: true,
    }
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` timestamps
);

export default mongoose.model("Slidder", SliderSchema);
