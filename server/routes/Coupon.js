import express from "express";
import { AddCoupon, deleteCoupon, GetCoupon, updateCoupon } from "../controllers/CouponController.js";

const router = express.Router();

router.post("/add", AddCoupon);
router.get("/", GetCoupon);
router.put("/update/:id", updateCoupon);
router.delete("/delete/:id", deleteCoupon);

export default router;
