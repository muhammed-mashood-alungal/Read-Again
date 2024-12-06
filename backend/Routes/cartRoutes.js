const express = require("express")
const { addToCart, getCart, changeQuantity, removeItem, getCartItemsCount } = require("../controller/cartController")
const { getCartTotalCount } = require("../controller/orderController")
const { userId } = require("../middlewares/auth")
const router = express.Router()

router.post('/:userId/add-to-cart',addToCart)
router.get('/:userId',getCart)
router.put('/:userId/update-quantity',changeQuantity)
router.put('/:userId/remove-item',removeItem)
router.get('/:userId/cart-items-count',getCartItemsCount)
module.exports = router