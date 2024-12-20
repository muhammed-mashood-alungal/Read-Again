const express = require('express')
const { addToWishlist, getUserWishlist, moveOneItemToCart, removeFromWishlist, removeItemFromWishlist, getItemsCount } = require('../controller/wishlistController')
const router = express.Router()


router.get('/:userId',getUserWishlist)
router.post('/:userId',addToWishlist)
router.put('/:userId/remove-item',removeItemFromWishlist)
router.get('/:userId/wishlist-items-count',getItemsCount)
module.exports = router