import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import UserRouter from "./routes/User.js";
import ProductRoutes from "./routes/Products.js";
import CategoryRoutes from "./routes/Category.js";
import SubCategoryRoutes from "./routes/SubCategory.js";
import SlidderRoutes from "./routes/Slider.js";
import EnquiryRoutes from "./routes/Enquiry.js";
import AddressRoutes from "./routes/Address.js";
import CouponRoutes from "./routes/Coupon.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

//error handel
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello GFG Developers",
  });
});

app.use("/api/user/", UserRouter);
app.use("/api/products/", ProductRoutes);
app.use("/api/category/", CategoryRoutes);
app.use("/api/subcategory/", SubCategoryRoutes);
app.use("/api/slider/", SlidderRoutes);
app.use("/api/enquiry/", EnquiryRoutes);
app.use("/api/address/", AddressRoutes);
app.use("/api/coupon/", CouponRoutes);

const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MODNO_DB)
    .then(() => console.log("Connected to MONGO DB"))
    .catch((err) => {
      console.error("failed to connect with mongo");
      console.error(err);
    });
};

const startServer = async () => {
  try {
    connectDB();
    app.listen(8080, () => console.log("Server started on port 8080"));
  } catch (error) {
    console.log(error);
  }
};

startServer();
