import express from "express";
import { addSliders, getSliders } from "../controllers/Slider.js";


const router = express.Router();

router.post("/add", addSliders);
router.get("/",getSliders)

export default router;
