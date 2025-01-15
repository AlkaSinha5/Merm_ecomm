import express from "express";
import { AddEnquiry, GetEnquiry } from "../controllers/Enquiry.js";



const router = express.Router();

router.post("/add", AddEnquiry);
router.get("/",GetEnquiry)

export default router;
