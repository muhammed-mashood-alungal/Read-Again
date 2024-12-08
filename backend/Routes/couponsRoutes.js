const express = require('express')
const { getAllCoupons, createCoupon, getCouponData, updateCoupon, handleCouponActivation } = require('../controller/couponController')
const router = express.Router()


router.get('/',getAllCoupons)
router.post('/',createCoupon)
router.get('/:couponId',getCouponData)
router.put('/:couponId',updateCoupon)
router.put('/handle-activation/:couponId',handleCouponActivation)


module.exports = router