const Book = require("../models/Books");
const Offer = require("../models/Offer");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
module.exports = {
  async createOffer(req, res) {
    try {
      const { offerData } = req.body;
      console.log(offerData)
      const newOffer = await Offer.create({ ...offerData });
      if (offerData.applicableTo == "CATEGORY") {
        for (let categoryId of offerData.applicableCategories) {
          const books = await Book.find({ category: categoryId }).populate(
            "appliedOffer"
          );
          for (let book of books) {
            book.appliedOffer = newOffer._id;
            await book.save();
          }
        }
      } else if (offerData.applicableTo == "PRODUCT") {
        for (let productId of offerData.applicableProducts) {
          const book = await Book.findOne({ _id: productId });
          book.appliedOffer = newOffer._id;
          book.save();
        }
      }
      res.status(StatusCodes.OK).json({ success: true });
    } catch (error) {
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR});
    }
  },
  async getAllOffers(req, res) {
    try {
      let { page, limit, name } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      let skip = (page - 1) * limit;
      let query = {};
      if (name) {
        query.name = { $regex: new RegExp(name, "i") };
      }

      const offers = await Offer.find(query)
        .skip(skip)
        .limit(limit)
        .populate("applicableProducts")
        .populate("applicableCategories");
      const totalOffers = await Offer.countDocuments({});
      res.status(StatusCodes.OK).json({ success: true, offers: offers, totalOffers });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR});
    }
  },
  async getOfferDetails(req, res) {
    try {
      const { offerId } = req.params;
      const offer = await Offer.findOne({ _id: offerId })
        .populate("applicableProducts")
        .populate("applicableCategories");
      res.status(StatusCodes.OK).json({ success: true, offer: offer });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR});
    }
  },
  async handleOfferActivation(req, res) {
    try {
      const { offerId } = req.params;
      const offer = await Offer.findOne({ _id: offerId });
      offer.isActive = !offer.isActive;
      if (!offer.isActive) {
        offer.expirationDate = new Date();

        const offeredBooks = await Book.find({ appliedOffer: offer._id });
        for (let book of offeredBooks) {
          const formatsKeys = Object.keys(book.formats);
          book.appliedOffer = null;

          book.save();
        }
      }
      await offer.save();
      res.status(StatusCodes.OK).json({ success: true });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR});
    }
  },
  async updateOffer(req, res) {
    try {
      const { offerId } = req.params;
      const { newOfferData } = req.body;
      newOfferData.isActive = true;

      const offerData = await Offer.findOneAndUpdate(
        { _id: offerId },
        {
          $set: { ...newOfferData },
        },
        { returnDocument: "before" }
      );

      if (newOfferData.applicableTo == "CATEGORY") {
        for (let categoryId of newOfferData.applicableCategories) {
          const books = await Book.find({ category: categoryId }).populate(
            "appliedOffer"
          );
          for (let book of books) {
            book.appliedOffer = offerId;
            await book.save();
          }
        }
      } else if (newOfferData.applicableTo == "PRODUCT") {
        for (let productId of newOfferData.applicableProducts) {
          const book = await Book.findOne({ _id: productId });
          book.appliedOffer = offerId;
          book.save();
        }
      }
      res.status(StatusCodes.OK).json({ success: true });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
};
