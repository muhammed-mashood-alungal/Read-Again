const express = require('express')
const router = express.Router()

const { createRazorpayOrder, verifyPayment } = require('../controller/razorpayController');

router.post('/create-order', createRazorpayOrder)
router.post('/verify-payment',verifyPayment)

module.exports = router