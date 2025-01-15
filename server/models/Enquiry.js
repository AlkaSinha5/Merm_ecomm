import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    
    },
    email: {
      type: String, 
      required: true,
    },
    message: {
        type: String, 
        required: true,
      },
      date: {
        type: Date,
        default: Date.now, 
      },
  },
  { timestamps: true } 
);

export default mongoose.model("Enquiry", EnquirySchema);
