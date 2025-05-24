const Coupon = require("../models/Coupon");

module.exports = {
  async couponExpiryMonitorJob() {
    try {
      const today = new Date();
      await Coupon.updateMany({ expirationDate: today }, { isActive: false });
    } catch (error) {
      console.log(error);
    }
  },
};
