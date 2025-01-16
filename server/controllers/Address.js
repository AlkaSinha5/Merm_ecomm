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
// 3. Update an Address
export const UpdateAddress = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the route parameters
    const updatedData = req.body; // Data to update from the request body

    const updatedAddress = await Address.findByIdAndUpdate(id, updatedData, { new: true }); // { new: true } returns the updated document

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address updated successfully", Address: updatedAddress });
  } catch (error) {
    res.status(500).json({ message: "Error updating address", error: error.message });
  }
};
