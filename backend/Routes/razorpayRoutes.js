// const express = require('express')
// const router = express.Router()

// router.post('/create-order', async (req, res) => {
//     try {
//         const options = {
//             amount: req.body.amount,
//             currency: 'INR',
//             receipt: 'receipt_' + Math.random().toString(36).substring(7),
//         };

//         const order = await razorpay.orders.create(options);
//         res.status(200).json(order);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });


// router.post('/verify-payment', async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//         const sign = razorpay_order_id + '|' + razorpay_payment_id;
//         const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
//             .update(sign.toString())
//             .digest('hex');

//         if (razorpay_signature === expectedSign) {
//             res.status(200).json({ message: 'Payment verified successfully' });
//         } else {
//             res.status(400).json({ error: 'Invalid payment signature' });
//         }
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router