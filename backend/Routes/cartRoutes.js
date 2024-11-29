const express = require("express")
const { addToCart, getCart, changeQuantity, removeItem } = require("../controller/cartController")
const router = express.Router()

router.post('/:userId/add-to-cart',addToCart)
router.get('/:userId',getCart)
router.put('/:userId/update-quantity',changeQuantity)
router.put('/:userId/remove-item',removeItem)
module.exports = router