import express from "express";
import { addSliders, deleteSlider, getSliders } from "../controllers/Slider.js";


const router = express.Router();

router.post("/add", addSliders);
router.get("/",getSliders)
router.delete("/delete/:id",deleteSlider)

export default router;
