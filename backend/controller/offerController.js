const Offer = require("../models/Offer")

module.exports = {
  async createOffer(req, res) {
    try {
      const { offerData } = req.body
      await Offer.create({ ...offerData })
      res.status(200).json({ success: true })
    } catch (error) {
      console.log(error)
      res.status(400).json({ success: false, message: "Something Went Wrong" })
    }
  },
  async getAllOffers(req, res) {
    try {
      const offers = await Offer.find({})
      .populate("applicableProducts")
      .populate("applicableCategories")
      res.status(200).json({ success: true, offers: offers })
    } catch (error) {
      console.log(error)
      res.status(400).json({ success: false, message: "Something Went wrong" })
    }
  },
  async getOfferDetails(req, res) {
    try {
      const { offerId } = req.params
      const offer = await Offer.findOne({ _id: offerId })
      .populate("applicableProducts")
      .populate("applicableCategories")
      res.status(200).json({ success: true, offer: offer })
    } catch (error) {
      res.status(400).json({ success: false, message: "Something Went wrong" })
    }
  },
  async handleOfferActivation(req, res) {
    try {
      const { offerId } = req.params
      const offer = await Offer.findOne({ _id: offerId })
      offer.isActive = !offer.isActive
      await offer.save()
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(400).json({ message: "Something went Wrong" })
    }
  },
  async updateOffer(req, res) {
    try {
      const { offerId } = req.params
      const { newOfferData } = req.body
      console.log(offerId,newOfferData)
      await Offer.updateOne({ _id: offerId }, {
        $set: { ...newOfferData }
      })
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(400).json({ message: "Something Went Wrong" })
    }
  }
}