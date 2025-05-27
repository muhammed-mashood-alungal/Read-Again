const Book = require("../models/Books");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
module.exports = {
  async addToWishlist(req, res) {
    try {
      const { userId } = req.params;
      const { itemId } = req.body;
      const wishlist = await Wishlist.findOne({ userId });
      if (!wishlist) {
        await Wishlist.create({ userId, items: [itemId] });
        return res.status(StatusCodes.OK).json({ success: true });
      }
      const isItemExist = wishlist.items.some((x) => x == itemId);
      if (isItemExist) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({
            success: false,
            message: "Item is Already in Your wishlist",
          });
      }
      wishlist.items.push(itemId);
      await wishlist.save();
      res.status(StatusCodes.OK).json({ success: true });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async removeItemFromWishlist(req, res) {
    try {
      const { userId } = req.params;
      const { itemId } = req.body;

      await Wishlist.updateOne(
        { userId },
        {
          $pull: { items: itemId },
        }
      );
      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async getUserWishlist(req, res) {
    try {
      const { userId } = req.params;
      const wishlist = await Wishlist.findOne({ userId }).populate({
        path: "items",
        populate: {
          path: "appliedOffer",
          model: "Offer",
        },
      });
      res
        .status(StatusCodes.OK)
        .json({ success: true, wishlist: wishlist.items });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async getItemsCount(req, res) {
    try {
      const { userId } = req.params;
      const wishlist = await Wishlist.findOne({ userId });
      const totalItems = wishlist?.items?.length;
      res.status(StatusCodes.OK).json({ success: true, totalItems });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: error?.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
    }
  },
};
