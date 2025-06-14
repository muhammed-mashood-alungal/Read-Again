const Book = require("../models/Books");
const { handleUpload, deleteImage } = require("../utils/cloudinary");
const Review = require("../models/Reviews");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const Category = require("../models/Category");
module.exports = {
  async createBook(req, res) {
    try {
      let {
        ISBN,
        title,
        author,
        category,
        language,
        description,
        publicationDate,
        formats,
      } = req.body;
      const imagePaths = [];

      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const b64 = Buffer.from(req.files[i].buffer).toString("base64");
          let dataURI = "data:" + req.files[i].mimetype + ";base64," + b64;
          const cldRes = await handleUpload(dataURI);
          const path = {
            secure_url: cldRes.secure_url,
            public_id: cldRes.public_id,
          };
          imagePaths.push(path);
        }
      }

      formats = JSON.parse(formats);
      const stockStatus =
        formats?.physical?.stock < 10 ? "Hurry Up" : "In Stock";
      const newBook = {
        ISBN ,
        title ,
        author ,
        category,
        language,
        description,
        publicationDate,
        images: imagePaths,
        formats: formats,
        stockStatus,
      };
      const book = await Book.create(newBook);

      res
        .status(StatusCodes.CREATED)
        .json({ message: ReasonPhrases.CREATED, book });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async getAllBooks(req, res) {
    try {
      let { page, limit, name } = req.query;
      const query = {};

      if (name) {
        query.title = { $regex: new RegExp(name, "i") };
      }
      page = parseInt(page);
      limit = parseInt(limit);
      let skip = (page - 1) * limit;
      const allBooks = await Book.find(query)
        .skip(skip)
        .limit(limit)
        .populate("category")
        .populate("appliedOffer");
      const totalBooks = await Book.countDocuments({});

      res
        .status(StatusCodes.OK)
        .json({ success: true, allBooks: allBooks, totalBooks });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async getBooksByFilter(req, res) {
    try {
      let { page, limit, sortBy, price, category } = req.query;

      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      let skip = (page - 1) * limit;

      let find = { isDeleted: false, "formats.physical.stock": { $gt: 0 } };

      
      let allBooks = await Book.find(find)
        .populate("category")
        .populate("appliedOffer");

      
      if (price !== "{}") {
        const priceRange = JSON.parse(price);
        allBooks = allBooks.filter((book) => {
          const originalPrice = book?.formats?.physical?.price || 0;
          const discount = book?.appliedOffer?.discountValue || 0;
          const finalPrice = originalPrice - (originalPrice * discount) / 100;

          return (
            priceRange["$gte"] <= finalPrice && priceRange["$lte"] >= finalPrice
          );
        });
      }

      
      if (category !== "All") {
        allBooks = allBooks.filter((book) => {
          return book?.category?.name === category;
        });
      }

      
      allBooks = allBooks.map((book) => {
        const originalPrice = book?.formats?.physical?.price || 0;
        const discount = book?.appliedOffer?.discountValue || 0;
        const finalPrice = originalPrice - (originalPrice * discount) / 100;
        return {
          ...book._doc,
          effectivePrice: finalPrice,
        };
      });

     
      if (sortBy === "Price: High to Low") {
        allBooks.sort((a, b) => b.effectivePrice - a.effectivePrice);
      } else if (sortBy === "Price: Low to High") {
        allBooks.sort((a, b) => a.effectivePrice - b.effectivePrice);
      } else if (sortBy === "Newness") {
        allBooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === "Average rating") {
        allBooks.sort((a, b) => b.averageRating - a.averageRating);
      } else if (sortBy === "A-Z") {
        allBooks.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === "Z-A") {
        allBooks.sort((a, b) => b.title.localeCompare(a.title));
      }

      const totalBooks = allBooks.length;

     
      allBooks = allBooks.slice(skip, skip + limit);

      res.status(StatusCodes.OK).json({
        success: true,
        books: allBooks,
        totalBooks,
      });
    } catch (err) {
      console.log(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async editBook(req, res) {
    try {
      const { bookId } = req.params;
      const {
        ISBN,
        title,
        author,
        category,
        language,
        description,
        publicationDate,
        formats,
      } = req.body;

      let stockStatus = null;
      const stock = formats.physical.stock;
      if (stock == 0) {
        stockStatus = "Stock Out";
      } else if (stock < 10) {
        stockStatus = "Hurry Up";
      } else {
        stockStatus = "In Stock";
      }
      const newBook = {
        ISBN,
        title,
        author,
        category,
        language,
        description,
        publicationDate,
        formats: formats,
        stockStatus,
      };

      const book = await Book.updateOne(
        { _id: bookId },
        { $set: newBook },
        { new: true }
      );
      res
        .status(StatusCodes.OK)
        .json({ message: "Book updated successfully", book });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async getBookData(req, res) {
    try {
      const { bookId } = req.params;
      let book = await Book.findOne({ _id: bookId })
        .populate("category")
        .populate("appliedOffer");
      res.status(StatusCodes.OK).json({ success: true, bookData: book });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async handleBookDelete(req, res) {
    try {
      const { bookId } = req.params;
      const book = await Book.findOne({ _id: bookId });
      if (!book) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "No such Book Found" });
      }
      book.isDeleted = !book.isDeleted;
      await book.save();
      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async getJustPublishedBooks(req, res) {
    try {
      const books = await Book.find({
        isDeleted: false,
        "formats.physical.stock": { $gt: 0 },
      })
        .populate("appliedOffer")
        .sort({ createdAt: -1 })
        .limit(8);
      res.status(StatusCodes.OK).json({ books: books });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async getRelatedBooks(req, res) {
    try {
      const { tags } = req.body;
      const { bookId } = req.params;
      const books = await Book.find({
        _id: { $ne: bookId },
        $or: tags,
        isDeleted: false,
        "formats.physical.stock": { $gt: 0 },
      })
        .populate("appliedOffer")
        .limit(8);
      res.status(StatusCodes.OK).json({ books: books });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async updateBookImage(req, res) {
    try {
      const { bookId } = req.params;
      const { oldUrl } = req.body;

      const updatingBook = await Book.findOne({ _id: bookId });
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);

      const images = [...updatingBook.images];
      const newImages = [];
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if (image.secure_url == oldUrl) {
          deleteImage(image.public_id);
          const newIMG = {
            secure_url: cldRes.secure_url,
            public_id: cldRes.public_id,
          };
          newImages.push(newIMG);
        } else {
          newImages.push(image);
        }
      }

      updatingBook.images = newImages;
      await updatingBook.save();

      res
        .status(StatusCodes.OK)
        .json({ message: "Successfully Updated", newImages });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async searchProducts(req, res) {
    try {
      const { title } = req.query;
      if (title.trim() == "") {
        return res.status(200).json({ products: [] });
      }
      const products = await Book.find({
        title: { $regex: title, $options: "i" },
      });
      res.status(StatusCodes.OK).json({ products: products });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async addReview(req, res) {
    try {
      const { userId, bookId } = req.params;
      const { rating, reviewText } = req.body;

      let cldRes;
      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        cldRes = await handleUpload(dataURI);
      }
      await Review.create({
        rating,
        reviewText,
        userId,
        bookId,
        image: {
          secure_url: cldRes?.secure_url,
          public_id: cldRes?.public_id,
        },
      });

      const reviews = await Review.find({ bookId });
      const totalRatings = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = totalRatings / reviews.length;
      await Book.findByIdAndUpdate(bookId, {
        $set: {
          averageRating,
        },
      });

      res.status(StatusCodes.OK).json({ success: true });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  },
  async removeReview(req, res) {
    try {
      const { reviewId } = req.params;
      const deletedReview = await Review.findOneAndDelete({ _id: reviewId });
      if (deletedReview && deletedReview?.image?.public_id) {
        deleteImage(deletedReview.image.public_id);
      }
      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async getBookReview(req, res) {
    try {
      const { bookId } = req.params;
      const reviews = await Review.find({ bookId }).populate("userId");
      res
        .status(StatusCodes.OK)
        .json({ success: true, reviews: reviews ? reviews : [] });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  },
  async getShowcaseData(req, res) {
    try {
      const books = await Book.find({
        "formats.physical.price": { $ne: 0 },
      }).populate("category");
      const categories = await Category.find({})
        .sort({ createdAt: -1 })
        .limit(4);
      const showcaseData = categories?.map((category, idx) => {
        const categoryBooks = books.filter(
          (book) => book?.category?.name === category?.name
        );

        const products = categoryBooks.map((book) => ({
          _id: book._id,
          images: book.images,
          title: book.title,
          formats: book.formats,
          appliedOffer: book.appliedOffer,
        }));

        return {
          title: category?.name,
          products: products,
        };
      });

      const filteredShowcase = showcaseData.filter(
        (categories) => categories?.products?.length > 2
      );
      res.status(StatusCodes.OK).json({ showcaseData: filteredShowcase });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
};
