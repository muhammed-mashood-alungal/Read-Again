const express = require('express')
const { addToWishlist,
    getUserWishlist,
    removeItemFromWishlist,
    getItemsCount } = require('../controller/wishlistController')
const { protect } = require('../middlewares/auth')
const router = express.Router()


router.get('/:userId',protect, getUserWishlist)
router.post('/:userId', protect,addToWishlist)
router.put('/:userId/remove-item',protect, removeItemFromWishlist)
router.get('/:userId/wishlist-items-count',protect, getItemsCount)

module.exports = router