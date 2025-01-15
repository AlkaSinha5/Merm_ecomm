import express from "express";
import Address from "../models/Address.js"; // Adjust the path if needed



// 1. Create an Address
export const AddAddress = async (req, res) => {
  try {
    const {  mobile,about, email,address,facebookLink,instagramLink,youtubeLink,twitterLink,linkedinLink } = req.body;
    const newAddress = new Address({ mobile,about, email,address,facebookLink,instagramLink,youtubeLink,twitterLink,linkedinLink });
    await newAddress.save();
    res.status(201).json({ message: "Address submitted successfully", Address: newAddress });
  } catch (error) {
    res.status(500).json({ message: "Error submitting Address", error: error.message });
  }
};

// 2. Get all enquiries
export const GetAddress = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving addresses", error: error.message });
  }
};