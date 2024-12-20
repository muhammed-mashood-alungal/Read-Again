const mongoose = require("mongoose")
const ReviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      required: true,
      maxlength: 500, 
    },
    image: {
        secure_url:{
           type:String
        },
        public_id:{
           type:String
        }
     },
},
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", ReviewSchema)
module.exports = Review;
