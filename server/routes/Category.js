import express from "express";
import { addCategorys, getCategorys } from "../controllers/Category.js";


const router = express.Router();

router.post("/add", addCategorys);
router.get("/",getCategorys)

export default router;
