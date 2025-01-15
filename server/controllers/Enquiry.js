import express from "express";
import Enquiry from "../models/Enquiry.js"; // Adjust the path if needed



// 1. Create an enquiry
export const AddEnquiry = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newEnquiry = new Enquiry({ name, email, message });
    await newEnquiry.save();
    res.status(201).json({ message: "Enquiry submitted successfully", enquiry: newEnquiry });
  } catch (error) {
    res.status(500).json({ message: "Error submitting enquiry", error: error.message });
  }
};

// 2. Get all enquiries
export const GetEnquiry = async (req, res) => {
  try {
    const enquiries = await Enquiry.find();
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving enquiries", error: error.message });
  }
};