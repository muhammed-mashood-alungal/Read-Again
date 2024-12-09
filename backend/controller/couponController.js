const Coupon = require("../models/Coupon")

module.exports={
    async createCoupon(req,res){
        try {
            const {couponData} = req.body
            console.log(req.body,couponData) 
            await Coupon.create(couponData)
            res.status(200).json({success:true})
        } catch (error) {
            console.log(error)
            res.status(400).json({message:"Something Went Wring while creating Coupon"})
        }
    },
    async getAllCoupons(req,res){
     try {
        const coupons = await Coupon.find({})
        console.log(coupons)
        res.status(200).json({success:true,coupons:coupons})
     } catch (error) {
        res.status(400).json({success:false,message:"Somthing went wrong"})
     }
    },
    async updateCoupon(req,res){
        try{
            console.log("hit end point")
            const {couponId} = req.params
            const {newCouponData} = req.body
            const currentDate = Date.now(); // Get the current timestamp
            if (currentDate > new Date(newCouponData.expirationDate).getTime()) {
              console.log("Coupon has expired");
              newCouponData.isActive = false; // Set isActive to false if expired
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
    }
}