const mongoose = require('mongoose')

const itemInfoSchema = mongoose.Schema({
    productId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"Book"
    },
    quantity:{
        type:Number,
        required:true
    },
    offer:{
      offerId :{
        type : mongoose.Types.ObjectId,
        default:null
      },
      discountedPrice:{
        type:Number,
        required:null
      }
    },
    addedAt:{
       type:Date,
       default:Date.now
    }
})

const CartSchema = mongoose.Schema({
   userId:{
    type:mongoose.Types.ObjectId,
    required:true
   },
   items:[itemInfoSchema],
   totalQuantity:{
    type:Number
   },
   totalAmount:{
    type:Number
   }
},{
   timestamps:true
});


const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
 