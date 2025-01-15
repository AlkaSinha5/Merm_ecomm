import express from "express";
import { addSubCategorys, getSubCategorys } from "../controllers/SubCategory.js";



const router = express.Router();

router.post("/add", addSubCategorys);
router.get("/",getSubCategorys)

export default router;
