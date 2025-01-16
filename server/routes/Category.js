import express from "express";
import { addCategorys, deleteCategory, getCategoryById, getCategorys, updateCategory } from "../controllers/Category.js";


const router = express.Router();

router.post("/add", addCategorys);
router.get("/",getCategorys);
router.get("/getById/:id", getCategoryById); // Get category by ID
router.put("/update/:id", updateCategory); // Update category by ID
router.delete("/delete/:id", deleteCategory);

export default router;
