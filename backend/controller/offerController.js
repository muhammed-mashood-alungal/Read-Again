const Book = require("../models/Books")
const Offer = require("../models/Offer")

module.exports = {
  async createOffer(req, res) {
    try {
      const { offerData } = req.body
      const newOffer = await Offer.create({ ...offerData })
      if (offerData.applicableTo == "CATEGORY") {
        for (let categoryId of offerData.applicableCategories) {
          const books = await Book.find({ category: categoryId }).populate("appliedOffer")
          for (let book of books) {
            book.appliedOffer = newOffer._id
            const formatsKeys = Object.keys(book.formats)
            for (let key of formatsKeys) {
              const format = book.formats[key]
              const originalPrice = format.price || 0
              const offerPrice = originalPrice - (originalPrice * (newOffer.discountValue / 100))
              book.formats[key].offerPrice = offerPrice.toFixed()
              await book.save()
            }
          }
        }
      } else if (offerData.applicableTo == "PRODUCT") {
        for (let productId of offerData.applicableProducts) {
          const book = await Book.findOne({ _id: productId })
          book.appliedOffer = newOffer._id
          const formatsKeys = Object.keys(book.formats)
          for (let key of formatsKeys) {
            const format = book.formats[key]
            const originalPrice = format.price || 0
            const offerPrice = Math.max(originalPrice - (originalPrice * (newOffer.discountValue / 100)), originalPrice - newOffer.maxDiscount)
            book.formats[key].offerPrice = offerPrice.toFixed()
          }
          book.save()
        }
      }
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(400).json({ success: false, message: "Something Went Wrong" })
    }
  },
  async getAllOffers(req, res) {
    try {
      let { page, limit, name } = req.query
      page = parseInt(page)
      limit = parseInt(limit)
      let skip = (page - 1) * limit
      let query = {}
      if (name) {
        query.name = { $regex: new RegExp(name, "i") };
      }

      const offers = await Offer.find(query).skip(skip).limit(limit)
        .populate("applicableProducts")
        .populate("applicableCategories")
      const totalOffers = await Offer.countDocuments({})
      res.status(200).json({ success: true, offers: offers, totalOffers })
    } catch (error) {
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
      if (!offer.isActive) {
        offer.expirationDate = new Date()

        const offeredBooks = await Book.find({ appliedOffer: offer._id })
        for (let book of offeredBooks) {
          const formatsKeys = Object.keys(book.formats)
          for (let key of formatsKeys) {
            book.formats[key].offerPrice = null
            book.appliedOffer = null
          }
          book.save()
        }
      }
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
      newOfferData.isActive = true

      const offerData = await Offer.findOneAndUpdate({ _id: offerId }, {
        $set: { ...newOfferData }
      }, { returnDocument: 'before' })

      if (newOfferData.applicableTo == "CATEGORY") {
        for (let categoryId of newOfferData.applicableCategories) {
          const books = await Book.find({ category: categoryId }).populate("appliedOffer")
          for (let book of books) {
            book.appliedOffer = offerId
            const formatsKeys = Object.keys(book.formats)
            for (let key of formatsKeys) {
              const format = book.formats[key]
              const originalPrice = format.price || 0
              const offerPrice = Math.max(originalPrice - (originalPrice * (newOfferData.discountValue / 100)), originalPrice - newOfferData.maxDiscount)
              book.formats[key].offerPrice = offerPrice.toFixed()
              await book.save()
            }
          }
        }
      } else if (newOfferData.applicableTo == "PRODUCT") {
        for (let productId of newOfferData.applicableProducts) {
          const book = await Book.findOne({ _id: productId })
          book.appliedOffer = offerId
          const formatsKeys = Object.keys(book.formats)
          for (let key of formatsKeys) {
            const format = book.formats[key]
            const originalPrice = format.price || 0
            const offerPrice = originalPrice - (originalPrice * (newOfferData.discountValue / 100))
            book.formats[key].offerPrice = offerPrice.toFixed()
          }
          book.save()
        }
      }
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(400).json({ message: "Something Went Wrong" })
    }
  }
}