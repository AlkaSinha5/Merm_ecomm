import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Orders from "../models/Orders.js";
import Products from "../models/Products.js"; // Ensure Products model is imported

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

    const order = new Orders({
      products,
      user: user._id,
      total_amount: totalAmount,
      address,
    });

    await order.save();
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
