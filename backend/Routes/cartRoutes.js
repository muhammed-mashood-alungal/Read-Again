const express = require("express");
const {
  addToCart,
  getCart,
  changeQuantity,
  removeItem,
  getCartItemsCount,
} = require("../controller/cartController");
const { protect } = require("../middlewares/auth");
const router = express.Router();

router.post("/:userId/add-to-cart", protect, addToCart);
router.get("/:userId", protect, getCart);
router.put("/:userId/update-quantity", protect, changeQuantity);
router.put("/:userId/remove-item", protect, removeItem);
router.get("/:userId/cart-items-count", protect, getCartItemsCount);
module.exports = router;
