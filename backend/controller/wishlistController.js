const Book = require("../models/Books")
const Cart = require("../models/Cart")
const Wishlist = require("../models/Wishlist")

module.exports = {
    async addToWishlist(req, res) {
        try {
            const { userId } = req.params
            const { itemId } = req.body
            const wishlist = await Wishlist.findOne({ userId })
            if (!wishlist) {
                await Wishlist.create({ userId, items: [itemId] })
                return res.status(200).json({ success: true })
            }
            const isItemExist = wishlist.items.some((x) => x == itemId)
            if (isItemExist) {
                return res.status(400).json({ success: false, message: "Item is Already in Your wishlist" })
            }
            wishlist.items.push(itemId)
            await wishlist.save()
            res.status(200).json({ success: true })
        } catch (error) {
            res.status(400).json({ success: false, message: "Something went wrong" })
        }
    },
    async removeItemFromWishlist(req, res) {
        try {
            const { userId } = req.params
            const { itemId } = req.body

            await Wishlist.updateOne({ userId }, {
                $pull: { items: itemId }
            })
            res.status(200).json({ success: true })

        } catch (err) {
            res.status(400).json({ message: "Something went wrong internallu" })
        }
    },
    async getUserWishlist(req, res) {
        try {
            const { userId } = req.params
            const wishlist = await Wishlist.findOne({ userId })
                .populate({
                    path: "items",
                    populate: {
                        path: "appliedOffer",
                        model: "Offer",
                    },
                })
            res.status(200).json({ success: true, wishlist: wishlist.items })
        } catch (err) {
            res.status(400).json({ message: "Something Went Wrong " })
        }
    },
    async getItemsCount(req, res) {
        try {
            const { userId } = req.params
            const wishlist = await Wishlist.findOne({ userId })
            const totalItems = wishlist?.items?.length
            res.status(200).json({ success: true, totalItems })
        } catch (error) {
            res.status(400).json({ success: false, message: error?.message })

        }
    }
}