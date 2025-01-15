import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
    
    },
    about: {
      type: String,
      required: true,
    
    },
    email: {
      type: String, 
      required: true,
    },
    address: {
        type: String, 
        required: true,
      },
      facebookLink:{
        type:String,
        required:true
      },
      instagramLink:{
        type:String,
        required:true
      },
      youtubeLink:{
        type:String,
        required:true
      },
      twitterLink:{
        type:String,
        required:true
      },
      linkedinLink:{
        type:String,
        required:true
      }
  },
  { timestamps: true } 
);

export default mongoose.model("Address", AddressSchema);
