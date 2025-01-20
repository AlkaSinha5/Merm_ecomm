import Coupon from "../models/coupon.js";
import Order from "../models/Orders.js";

export const AddCoupon = async (req, res) => {
  const { code, discountPercent, expiryDate, isActive } = req.body;

  // Ensure isActive is a boolean value, whether it comes as string or boolean
  const couponIsActive = typeof isActive === 'string' ? isActive === 'true' : isActive;

  try {
    const newCoupon = new Coupon({
      code,
      discountPercent,
      expiryDate,
      isActive: couponIsActive,  // Ensure it’s stored as boolean
    });

    const savedCoupon = await newCoupon.save();
    res.status(201).json({ coupon: savedCoupon });
  } catch (err) {
    res.status(500).json({ message: "Failed to add coupon. Please try again." });
  }
  };


  export const GetCoupon = async (req, res, next) => {
    try {
      const coupon = await Coupon.find();
      if (coupon.length === 0) {
        return res.status(404).json({ message: "No coupon found" });
      }
      return res.status(200).json({ message: "Coupon retrieved successfully", coupon });
    } catch (err) {
     
      return res.status(500).json({ message: "Internal server error", error: err.message });
    }
  };
  export const updateCoupon = async (req, res) => {
    const { id } = req.params;
    const { code, discountPercent, expiryDate, isActive } = req.body;
  
    // Ensure isActive is a boolean value, whether it comes as string or boolean
    const couponIsActive = typeof isActive === 'string' ? isActive === 'true' : isActive;
  
    try {
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        id,
        { code, discountPercent, expiryDate, isActive: couponIsActive },
        { new: true }
      );
  
      if (!updatedCoupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
  
      res.status(200).json({ coupon: updatedCoupon });
    } catch (err) {
      res.status(500).json({ message: "Failed to update coupon. Please try again." });
    }
  };
  
  // Delete Coupon
  export const deleteCoupon = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedCoupon = await Coupon.findByIdAndDelete(id);
  
      if (!deletedCoupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
  
      res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete coupon. Please try again." });
    }
  };

  export const applyCoupon = async (req,res)=>{
    try {
      const { couponCode, subtotal } = req.body;
  
      if (!couponCode) {
        return res.status(400).json({ message: "Coupon code is required" });
      }
  
      // Find the coupon by code
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
  
      if (!coupon) {
        return res.status(404).json({ message: "Invalid coupon code" });
      }
  
      // Check if the coupon is valid based on dates
      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validTo) {
        return res.status(400).json({ message: "Coupon is not valid anymore" });
      }
  
      // Calculate discount
      const discountAmount = (subtotal * coupon.discountPercent) / 100;
      const discountedTotal = subtotal - discountAmount;
  
      return res.status(200).json({
        discountAmount,
        discountedTotal,
        message: `Coupon applied successfully!`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }