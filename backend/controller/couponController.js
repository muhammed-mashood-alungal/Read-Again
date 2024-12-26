const { json } = require("express")
const Coupon = require("../models/Coupon")

module.exports = {
    async createCoupon(req, res) {
        try {
            const { couponData } = req.body
            const coupon = await Coupon.findOne({ code: couponData.code })
            if (coupon) {
                return res.status(400).json({ message: "Coupon With This Coupon Code Already Exist. Try Another Code" })
            }
            await Coupon.create(couponData)
            res.status(200).json({ success: true })
        } catch (error) {
            res.status(400).json({ message: "Something Went Wrong while creating Coupon" })
        }
    },
    async getAllCoupons(req, res) {
        try {

            let { page, limit, name } = req.query
            const query = {};

            if (name) {
                query.code = { $regex: new RegExp(name, "i") };
            }
            page = parseInt(page)
            limit = parseInt(limit)
            let skip = (page - 1) * limit

            const coupons = await Coupon.find(query).skip(skip).limit(limit)
            const totalCoupons = await Coupon.countDocuments({})
            res.status(200).json({ success: true, coupons: coupons, totalCoupons })
        } catch (error) {
            res.status(400).json({ success: false, message: "Somthing went wrong" })
        }
    },
    async updateCoupon(req, res) {
        try {
            const { couponId } = req.params
            const { newCouponData } = req.body
            const currentDate = Date.now();
            if (currentDate > new Date(newCouponData.expirationDate).getTime()) {
                newCouponData.isActive = false;
            } else {
                newCouponData.isActive = true
            }
            const newDoc = await Coupon.findOneAndUpdate({ _id: couponId }, {
                $set: { ...newCouponData }
            }, { new: true })
            res.status(200).json({ success: true })

        } catch (error) {
            res.status(400).json({ success: false, message: "Something went Wrong...!" })
        }
    },
    async getCouponData(req, res) {
        try {
            const { couponId } = req.params
            const couponData = await Coupon.findOne({ _id: couponId })
            res.status(200).json({ success: true, couponData: couponData })
        } catch (error) {
            res.status(400).json({ success: false, message: "Something went wrong" })
        }
    },
    async handleCouponActivation(req, res) {
        try {
            const { couponId } = req.params
            const coupon = await Coupon.findOne({ _id: couponId })
            coupon.isActive = !coupon.isActive
            await coupon.save()
            res.status(200).json({ success: true })
        } catch (error) {
            res.status(400).json({ success: false, message: "Something went wrong" })
        }
    },
    async verifyCoupon(req, res) {
        try {
            const { coupon, amount } = req.body
            const couponData = await Coupon.findOne({ code: coupon })
            if (!couponData) {
                return res.status(400).json({ message: "Invalid Coupon Code" })
            }
            const currentDate = new Date()
            if (!couponData.isActive || new Date(couponData.expirationDate) < currentDate) {
                couponData.isActive = false
                couponData.save()
                return res.status(400).json({ message: "Coupon Expired" })
            }
            if (couponData.currentUsage >= coupon.maxUsage) {
                couponData.isActive = false
                couponData.save()
                return res.status(400).json({ message: "Coupon Exceed its Maximum Usage" })
            }
            if (amount < couponData.minimumPrice) {
                return res.status(400).json({ message: `You need to purchase for minimum ${couponData.minimumPrice} for apply this coupon` })
            }
            const discountValue = (amount * (couponData.discountValue / 100))
            const discountedPrice = Math.min(discountValue.toFixed(), couponData.maxDiscount)
            res.status(200).json({ success: true, discountedPrice })
        } catch (error) {
            res.status(400).json({ message: "Something went Wrong" })
        }
    }
}