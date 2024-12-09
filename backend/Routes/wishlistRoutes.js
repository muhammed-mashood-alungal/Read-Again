const express = require('express')
const { addToWishlist, getUserWishlist, moveOneItemToCart, removeFromWishlist, removeItemFromWishlist } = require('../controller/wishlistController')
const router = express.Router()


router.get('/:userId',getUserWishlist)
router.post('/:userId',addToWishlist)
router.put('/:userId/remove-item',removeItemFromWishlist)
module.exports = router