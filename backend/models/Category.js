const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
   name: {
    type: String,
    required: true
   },
   image: {
      type: String, 
      required: true
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
