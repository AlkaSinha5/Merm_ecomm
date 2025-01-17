import express from "express";
import { addSubCategorys, deleteSubCategory, getSubCategoriesByCategoryId, getSubCategorys, updateSubCategory } from "../controllers/SubCategory.js";



const router = express.Router();

router.post("/add", addSubCategorys);
router.get("/",getSubCategorys);
router.get("/:categoryId",getSubCategoriesByCategoryId);
router.put("/update/:id", updateSubCategory);
router.delete("/delete/:id", deleteSubCategory);

export default router;
