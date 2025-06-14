const mongoose = require("mongoose");

const BookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    language: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    publicationDate: {
      type: String,
      required: true,
      
    },
    ISBN: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        secure_url: {
          type: String,
        },
        public_id: {
          type: String,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    formats: {
      physical: {
        price: {
          type: Number,
        },
        stock: {
          type: Number,
        },
      },
      ebook: {
        price: {
          type: Number,
        },
        fileUrl: {
          type: String,
        },
        fileSize: {
          type: Number,
        },
      },
      audiobook: {
        price: {
          type: Number,
        },
        duration: {
          Number,
        },
        fileUrl: String,
      },
    },
    appliedOffer: {
      type: mongoose.Types.ObjectId,
      ref: "Offer",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    stockStatus: {
      type: String,
      enum: ["In Stock", "Hurry Up", "Out Of Stock"],
      default: "In Stock",
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", BookSchema);
module.exports = Book;
