import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  { 
    photo:{
    type: String,
    default:""
  },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"], 
      default: "user", 
    },
    cart: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
          quantity: { type: Number, default: 1 },
        },
      ],
      default: [],
    },
    favourites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Products",
      default: [],
    },
    orders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Shopping-Orders",
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
