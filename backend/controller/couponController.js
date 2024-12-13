const { json } = require("express")
const Coupon = require("../models/Coupon")

module.exports={
    async createCoupon(req,res){
        try {
            const {couponData} = req.body
            console.log(req.body,couponData) 
            const coupon = await Coupon.findOne({code:couponData.code})
            if(coupon){
                return res.status(400).json({message:"Coupon With This Coupon Code Already Exist. Try Another Code"})
            }
            await Coupon.create(couponData)
            res.status(200).json({success:true})
        } catch (error) {
            console.log(error)
            res.status(400).json({message:"Something Went Wrong while creating Coupon"})
        }
    },
    async getAllCoupons(req,res){
     try {

        let { page, limit, name } = req.query
        console.log(req.query)
        const query = {};

        if (name) {
            query.code = { $regex: new RegExp(name, "i") };
        }
        page = parseInt(page)
        limit = parseInt(limit)
        let skip = (page - 1) * limit

        /*
         let { page, limit, name } = req.query
            console.log(req.query)
            const query = {};

            if (name) {
                query.title = { $regex: new RegExp(name, "i") };
            }
            page = parseInt(page)
            limit = parseInt(limit)
            let skip = (page - 1) * limit
            const allBooks = await Book.find(query).skip(skip).limit(limit).populate("category").populate("appliedOffer")
            const totalBooks = await Book.countDocuments({})

            res.status(200).json({ success: true, allBooks: allBooks, totalBooks });
        */
        const coupons = await Coupon.find(query).skip(skip).limit(limit)
        const totalCoupons = await Coupon.countDocuments({})
        console.log(coupons)
        res.status(200).json({success:true,coupons:coupons , totalCoupons})
     } catch (error) {
        res.status(400).json({success:false,message:"Somthing went wrong"})
     }
    },
    async updateCoupon(req,res){
        try{
            console.log("hit end point")
            const {couponId} = req.params
            const {newCouponData} = req.body
            const currentDate = Date.now(); 
            if (currentDate > new Date(newCouponData.expirationDate).getTime()) {
              console.log("Coupon has expired");
              newCouponData.isActive = false;
            }else{
                newCouponData.isActive = true
            }
           const newDoc= await Coupon.findOneAndUpdate({_id:couponId},{
                $set:{...newCouponData}
            },{new:true})
            console.log(newDoc)
            res.status(200).json({success:true})
            
        }catch(error){
            console.log(error) 
            res.status(400).json({success:false,message:"Something went Wrong...!"})
        }
    },
    async getCouponData(req,res){
        try {
            const {couponId} = req.params
            const couponData = await Coupon.findOne({_id:couponId})
            res.status(200).json({success:true,couponData:couponData})
        } catch (error) {
            res.status(400).json({success:false,message:"Something went wrong"})
        }
    },
    async handleCouponActivation(req,res){
        try {
            const {couponId} = req.params
            console.log(couponId)
            const coupon = await Coupon.findOne({_id:couponId})
            console.log(coupon.isActive)
            coupon.isActive = !coupon.isActive
            await coupon.save()
            res.status(200).json({success:true})
        } catch (error) {
            console.log(error)
            res.status(400).json({success:false,message:"Something went wrong"})
        }
    },
    async verifyCoupon(req,res){
        try {
            const {coupon,amount}=req.body
            const couponData = await Coupon.findOne({code:coupon})
            if(!couponData){
               return res.status(400).json({message:"Invalid Coupon Code"})
            }
            const currentDate = new Date()
            console.log(couponData.isActive,couponData.expirationDate)
            if(!couponData.isActive || new Date(couponData.expirationDate) < currentDate){
                return res.status(400).json({message:"Coupon Expired"})
            }
            if(couponData.currentUsage >= coupon.maxUsage){
                return res.status(400).json({message:"Coupon Exceed its Maximum Usage"})
            }
            if(amount < couponData.minimumPrice){
                return res.status(400).json({message:`You need to purchase for minimum ${couponData.minimumPrice} for apply this coupon`})
            }
            console.log(amount)
            console.log((amount * (couponData.discountValue/100)))
            const discountValue = (amount * (couponData.discountValue/100))
            console.log(discountValue)
            const discountedPrice = Math.min(discountValue.toFixed(),couponData.maxDiscount)
            console.log(discountedPrice)
            res.status(200).json({success:true,discountedPrice})
        } catch (error) {
            res.status(400).json({message:"Something went Wrong"})
        }
    }
}