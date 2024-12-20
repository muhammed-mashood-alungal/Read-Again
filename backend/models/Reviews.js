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
      minlength: 50, 
      maxlength: 500, 
    },
    images: [
      {
        type: String,
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", ReviewSchema)
module.exports = Review;
