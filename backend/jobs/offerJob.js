const Offer = require("../models/Offer");

module.exports = {
  async OfferExpiryMonitorJob  () {
  try {
    const today = new Date();
    await Offer.updateMany(
      { expirationDate: today },
      {
        isActive: false,
      }
    );
  } catch (error) {
    console.log(error);
  }
}
}
