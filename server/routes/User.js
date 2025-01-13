import express from "express";
import {
  UserData,
  UserLogin,
  UserRegister,
  addToCart,
  addToFavorites,
  deleteUser,
  getAllCartItems,
  getAllOrders,
  getAllOrdersAdmin,
  getUserFavourites,
  placeOrder,
  removeFromCart,
  removeFromFavorites,
} from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", UserRegister);
router.post("/signin", UserLogin);
router.get("/get",UserData)
router.delete("/delete/:id",deleteUser)

//cart
router.get("/cart", verifyToken, getAllCartItems);
router.post("/cart", verifyToken, addToCart);
router.patch("/cart", verifyToken, removeFromCart);

//order
router.get("/order", verifyToken, getAllOrders);
router.get("/orderAdmin", verifyToken, getAllOrdersAdmin);
router.post("/order", verifyToken, placeOrder);

//favourites
router.get("/favorite", verifyToken, getUserFavourites);
router.post("/favorite", verifyToken, addToFavorites);
router.patch("/favorite", verifyToken, removeFromFavorites);

export default router;
