const mongoose = require('mongoose')

const CouponSchema = mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    discountValue:{
        type:Number,
        required:true
    },
    expirationDate:{
        type:Date,
        required:true
    },
    limit:{
        type:Number,
        required:true
    },
    applicableProducts:{
        type:[mongoose.Types.ObjectId],
        ref:"Book"
    },
    applicableCategories:{
        type:[mongoose.Types.ObjectId],
        ref:"Category"
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

const Coupon = mongoose.model('Coupon',CouponSchema)
module.exports = Coupon