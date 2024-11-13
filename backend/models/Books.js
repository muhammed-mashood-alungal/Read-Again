const mongoose = require('mongoose')

const BookSchema = mongoose.Schema({
   title: {
    type: String,
    required: true
   },
   author: {
      type:String, 
      required: true
   },
   category:{
      type:String,
      required:true
   },
   genre:{
    type:String
   },
   description:{
    type:String,
    required:true
   },
   publicationDate:{
    type : String,
    required:true
   },
   ISBN:{
    type:String,
    required:true
   },
   images:[String],
   formats:{
    physical:{
        price:{
            type:Number
        },
        stock:{
            type:Number
        }
    },
    ebook:{
        price:{
            type:Number
        },
        fileUrl:{
            type:String
        },
        fileSize:{
            type:Number
        }
    },
    audiobook:{
        price:{
            type:Number
        },
        duration:{
            Number
        },
        fileUrl:String
    }
   },
   isDeleted:{
    type:Boolean,
    default:false
   }

},{
   timestamps:true
});


const Book = mongoose.model('Book', BookSchema);
module.exports = Book;
