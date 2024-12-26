const express = require('express')
const { getAllCoupons,
    createCoupon,
    getCouponData,
    updateCoupon,
    handleCouponActivation,
    verifyCoupon } = require('../controller/couponController')
const { getAvailableCoupons } = require('../controller/userController')
const router = express.Router()
const { isAdmin, protect } = require('../middlewares/auth');


router.get('/', isAdmin, getAllCoupons)
router.post('/', isAdmin, createCoupon)
router.get('/:couponId', getCouponData)
router.put('/:couponId', isAdmin, updateCoupon)
router.put('/handle-activation/:couponId', isAdmin, handleCouponActivation)
router.post('/verify-coupon', protect,verifyCoupon)
router.get('/:userId/available-coupons',protect ,getAvailableCoupons)

module.exports = router