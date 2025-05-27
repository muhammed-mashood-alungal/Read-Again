const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
module.exports = {
  async createRazorpayOrder(req, res) {
    try {
      const options = {
        amount: req.body.amount,
        currency: "INR",
        receipt: "receipt_" + Math.random().toString(36).substring(7),
      };
      const order = await razorpay.orders.create(options);
      res.status(StatusCodes.OK).json(order);
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    }
  },
  async verifyPayment(req, res) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature === expectedSign) {
        res
          .status(StatusCodes.OK)
          .json({ message: "Payment verified successfully" });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid payment signature" });
      }
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    }
  },
};
