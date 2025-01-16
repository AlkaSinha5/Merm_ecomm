import express from "express";
import { AddAddress, GetAddress, UpdateAddress } from "../controllers/Address.js";

const router = express.Router();

router.post("/add", AddAddress);
router.get("/",GetAddress)
router.put("/update/:id",UpdateAddress)

export default router;
