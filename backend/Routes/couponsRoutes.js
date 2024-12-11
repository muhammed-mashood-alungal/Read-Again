const express = require('express')
const { getAllCoupons, createCoupon, getCouponData, updateCoupon, handleCouponActivation, verifyCoupon } = require('../controller/couponController')
const router = express.Router()


router.get('/',getAllCoupons)
router.post('/',createCoupon)
router.get('/:couponId',getCouponData)
router.put('/:couponId',updateCoupon)
router.put('/handle-activation/:couponId',handleCouponActivation)
router.post('/verify-coupon',verifyCoupon)

module.exports = router