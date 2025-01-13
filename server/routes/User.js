import express from "express";
import {
  UserData,
  UserDataGet,
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
  upDateOrderStatus,
} from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", UserRegister);
router.post("/signin", UserLogin);
router.get("/get",UserData);
router.get("/get/:id",UserDataGet)
router.delete("/delete/:id",deleteUser)

//cart
router.get("/cart", verifyToken, getAllCartItems);
router.post("/cart", verifyToken, addToCart);
router.patch("/cart", verifyToken, removeFromCart);

//order
router.get("/order", verifyToken, getAllOrders);
router.get("/orderAdmin", verifyToken, getAllOrdersAdmin);
router.post("/order", verifyToken, placeOrder);
router.patch("/orderupdate/:id",verifyToken,upDateOrderStatus)

//favourites
router.get("/favorite", verifyToken, getUserFavourites);
router.post("/favorite", verifyToken, addToFavorites);
router.patch("/favorite", verifyToken, removeFromFavorites);

export default router;
