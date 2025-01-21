import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Orders from "../models/Orders.js";
import Products from "../models/Products.js"; // Ensure Products model is imported
import { v2 as cloudinary } from "cloudinary";
import crypto from 'crypto';
import { sendEmail } from '../helper/sendMail.js'; // Adjust path if necessary


cloudinary.config({
  cloud_name: "dhzk0ztrn",
  api_key: "571339484391153",
  api_secret: "WWmOJpVF5y02r7Blu2oAr0RxbU0",
});

dotenv.config();

// User Register
export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(409, "Email is already in use"));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
    });

    const createdUser =  user.save();
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    return res.status(200).json({ token, user: createdUser, message:"You Register Successfully"});
  } catch (error) {
    return next(error);
  }
};

// User Login
export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    
    if (!existingUser) {
      // return next(createError(404, "User not found"));
      return res.status(404).json({ message: "Incorrect Email" });
    }
    // const isEmailCorrect = 
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
      // return next(createError(403, "Incorrect password"));
      return res.status(403).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    return res
      .status(200)
      .json({ token, user: existingUser, message: "Login Successfully" });
  } catch (error) {
    return next(error);
  }
};


export const UserUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, photo, email } = req.body;

    // Validate MongoDB Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // Find the existing category
    const existingUser= await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // If a new image is provided, upload to Cloudinary
    let updatedImageUrl = existingUser.photo;
    if (photo) {
      const uploadedImage = await cloudinary.uploader.upload(photo, {
        folder: "Users", // Specify the folder in Cloudinary
      });
      updatedImageUrl = uploadedImage.secure_url;
    }

    // let hashedPassword = existingUser.password; // Default to the current password if not updated
    // if (password) {
    //   const salt = await bcrypt.genSalt(10); // Generate salt
    //   hashedPassword = await bcrypt.hash(password, salt); // Hash the password
    // }
    // Update Category fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, photo: updatedImageUrl },
      { new: true } // Return the updated document
    );

    return res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    // console.error("Error while updating category:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


export const UserGetById = async(req,res) =>{
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error: error.message });
  }
}
export const UserData = async(req,res)=>{
  try {
    // Fetch all users from the database (you can add pagination, filtering, etc. as needed)
    const users = await User.find(); 
  const usersCount = await User.countDocuments()

    res.status(200).json({
      message: "Users fetched successfully",
      users: users,
      count:usersCount
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching users",
      error: err.message,
    });
  }
}
export const UserDataGet = async (req, res) => {
  try {
    // Fetch user ID from request parameters
    const userId = req.params.id;

    // Fetch user data with cart and favourites
    const user = await User.findById(userId);

    // If user is not found, return a 404 response
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Calculate cart and favourite lengths
    const cartLength = user.cart ? user.cart.length : 0;
    const favouriteLength = user.favourites ? user.favourites.length : 0;

    // Send response with user data and calculated lengths
    res.status(200).json({
      message: "User data fetched successfully",
      user: {
        ...user.toObject(), // Convert Mongoose document to plain JavaScript object
        cartLength,
        favouriteLength,
      },
    });
  } catch (err) {
    // Handle errors and send a 500 response
    res.status(500).json({
      message: "Error fetching user data",
      error: err.message,
    });
  }
};


export const deleteUser = async(req,res)=>{
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId); // Replace with your user model logic
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
}
// Add to Cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0 ) {
      return res.status(400).json({ message: "Invalid product or quantity" });
    }

    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    const existingCartItemIndex = user.cart.findIndex((item) =>
      item?.product?.equals(productId)
    );

    if (existingCartItemIndex !== -1) {
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    return res
      .status(200)
      .json({ message: "Product added to cart successfully", cart: user.cart });
  } catch (err) {
    next(err);
  }
};

// Remove from Cart
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    if (!user) {
      // return next(createError(404, "User not found"));
      return res.status(404).json({ message: "User not found" });
    }

    const productIndex = user.cart.findIndex((item) =>
      item.product.equals(productId)
    );

    if (productIndex !== -1) {
      if (quantity && quantity > 0) {
        user.cart[productIndex].quantity -= quantity;

        if (user.cart[productIndex].quantity <= 0) {
          user.cart.splice(productIndex, 1);
        }
      } else {
        user.cart.splice(productIndex, 1);
      }

      await user.save();
      return res
        .status(200)
        .json({ message: "Product removed from cart", cart: user.cart });
    } else {
      // return next(createError(404, "Product not found in the user's cart"));
      return res.status(404).json({ message: "Product not found in the user's cart" });
    }
  } catch (err) {
    next(err);
  }
};

// Get All Cart Items
export const getAllCartItems = async (req, res, next) => {
  try {
    const userJWT = req.user;
    const user = await User.findById(userJWT.id).populate({
      path: "cart.product",
      model: "Products",
    });

    if (!user) {
      // return next(createError(404, "User not found"));
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.cart);
  } catch (err) {
    next(err);
  }
};

// Place Order
export const placeOrder = async (req, res, next) => {
  try {
    const { products, address, totalAmount } = req.body;

    if (!products || !address || !totalAmount) {
      return res.status(400).json({ message: "Invalid order details" });
    }

    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    // Create the order
    const order = new Orders({
      products,
      user: user._id,
      total_amount: totalAmount,
      address,
    });

    for (let productItem of products) {
     
      const product = await Products.findById(productItem.product._id);
     
      // Validate if the product exists
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${productItem.product._id} not found` });
      }

      // Check if the product has enough quantity
      if (product.quantity < productItem.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.title}` });
      }

      // Reduce the product quantity
      product.quantity -= productItem.quantity;
      await product.save(); // Save the updated product quantity
    }

    // Save the order
    await order.save();

    // Clear the user's cart
    user.cart = [];
    await user.save();

    return res.status(200).json({ message: "Order placed successfully", order });
  } catch (err) {
    next(err);
  }
};



// Get All Orders
export const getAllOrders = async (req, res, next) => {
  try {
    const userJWT = req.user;
    const orders = await Orders.find({ user: userJWT.id });

    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const userJWT = req.user;
    const orders = await Orders.find();

    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

// Add to Favorites
export const addToFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }

    return res
      .status(200)
      .json({ message: "Product added to favorites", favourites: user.favourites });
  } catch (err) {
    next(err);
  }
};

// Remove from Favorites
export const removeFromFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    user.favourites = user.favourites.filter((fav) => !fav.equals(productId));
    await user.save();

    return res
      .status(200)
      .json({ message: "Product removed from favorites", favourites: user.favourites });
  } catch (err) {
    next(err);
  }
};

// Get User Favorites
export const getUserFavourites = async (req, res, next) => {
  try {
    const userJWT = req.user;
    const user = await User.findById(userJWT.id).populate("favourites");

    if (!user) {
      // return next(createError(404, "User not found"));
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.favourites);
  } catch (err) {
    next(err);
  }
};


import mongoose from 'mongoose';

export const upDateOrderStatus = async (req, res) => {

  const orderId  = req.params.id; // Extract orderId from request params
  const { orderShipping, orderProcess, orderDeliverd, orderCancel } = req.body; // Extract status fields from request body

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  try {
    // Find and update the order by its ID with the new status values
    const updatedOrder = await Orders.findByIdAndUpdate(orderId, {
      orderShipping,
      orderProcess,
      orderDeliverd,
      orderCancel,
    }, { new: true }); // 'new: true' ensures the updated order is returned

    console.log('Updated Order:', updatedOrder);

    // Check if the order was found and updated
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return the updated order as a response
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  const { OldPassword, NewPassword } = req.body;

  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
    
    if (!token) {
      return res.status(400).json({ error: "JWT must be provided", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT); // Ensure the secret matches what's used for signing the token

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }
    console.log(OldPassword)
    
    const isMatch = await bcrypt.compare(OldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password does not match", success: false });
    }
     console.log(NewPassword)
    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(NewPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).send({
      statusCode: 200,
      message: "Password Updated Successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      statusCode: 500,
      error: error.message,
      success: false,
    });
  }
};



// In-memory store for tokens
let resetTokens = {}; // This object will store tokens temporarily with expiration times

// Send password reset email
export const sendMailforForgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(200).json({ message: 'User with given email does not exist', success: false });

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Store the token in memory with an expiration time (1 hour from now)
    resetTokens[resetToken] = {
      userId: user._id,
      expireAt: Date.now() + 3600000, // Token expires in 1 hour
    };

    const link = `http://localhost:3000/user/resetPasword/${user._id}/${resetToken}`;
    
    // Send the reset email
    await sendEmail(user.email, "Password Reset", link);

    return res.status(200).json({ message: 'Password reset link sent to your email account', success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { userId, token } = req.params;

    // Optional: Add token validation logic here if needed (uncomment and modify as required)
    // if (!resetTokens[token] || resetTokens[token].expireAt < Date.now()) {
    //   return res.status(400).json({ message: 'Invalid link or expired', success: false });
    // }
    // if (resetTokens[token].userId !== userId) {
    //   return res.status(400).json({ message: 'Invalid link or expired', success: false });
    // }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found', success: false });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Salt rounds set to 10

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Optional: Remove the token from memory (if you are using in-memory tokens)
    // delete resetTokens[token];

    return res.status(200).json({ message: 'Password reset successfully', success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

