import express from "express";
import {
  addProducts,
  deleteProducts,
  getProductById,
  getproducts,
  updateProducts,
} from "../controllers/Products.js";

const router = express.Router();

router.post("/add", addProducts);
router.get("/", getproducts);
router.get("/:id", getProductById);
router.delete("/delete/:id", deleteProducts);
router.put("/update/:id",updateProducts)

export default router;
