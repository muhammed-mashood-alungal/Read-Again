const mongoose = require('mongoose')

const offerSchema = mongoose.Schema({
     name:{
        type:String,
        required:true,
        trim:true
     },
     description:{
        type:String
     },
     discountValue:{
        type:Number,
       required:true
     },
     maxDiscount:{
        type:Number,
        required:true
     },
     applicableTo:{
         type:String,
         required:true,
         enum:["PRODUCT","CATEGORY"]
     },
     applicableProducts:[{
        type:mongoose.Types.ObjectId,
        ref:'Book',
        required:function (){
           return this.applicableTo == 'PRODUCT'
        }
     }],
     applicableCategories:[{
        type:mongoose.Types.ObjectId,
        ref:"Category",
        required:function (){
            return this.applicableTo == 'Category'
        }
     }],
     maxUsage:{
        type:Number,
        required:true
     },
     currentUsage:{
        type:Number
     },
     startDate:{
        type:Date,
        required:true
     },
     expirationDate:{
        type:Date,
        required:true
     },
     isActive:{
        type:Boolean,
        default:true
     }
},{
    timestamps:true
})

const Offer = mongoose.model('Offer',offerSchema)
module.exports = Offer