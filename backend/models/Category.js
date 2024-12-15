const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
   name: {
    type: String,
    required: true
   },
   image: {
      secure_url:{
         type:String
      },
      public_id:{
         type:String
      }
   },
   listed:{
      type:Boolean,
      default:true
   }
},{
   timestamps:true
});


const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
