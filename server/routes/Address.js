import express from "express";
import { AddAddress, GetAddress } from "../controllers/Address.js";

const router = express.Router();

router.post("/add", AddAddress);
router.get("/",GetAddress)

export default router;
