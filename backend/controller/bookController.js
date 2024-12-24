const Book = require("../models/Books");
const fs = require('fs')
const path = require('path');
const Offer = require("../models/Offer");
const { log } = require("console");
const { handleUpload, deleteImage } = require("../utils/cloudinary");
const Review = require("../models/Reviews");
module.exports = {
    async createBook(req, res) {
        try {
            let { ISBN, title, author, category, language, description, publicationDate, formats } = req.body;
            const imagePaths = [];
         
            if (req.files && req.files.length > 0) {
                for (let i = 0; i < req.files.length; i++) {
                    const b64 = Buffer.from(req.files[i].buffer).toString("base64");
                    let dataURI = "data:" + req.files[i].mimetype + ";base64," + b64;
                    const cldRes = await handleUpload(dataURI)
                    const path = {
                        secure_url: cldRes.secure_url,
                        public_id: cldRes.public_id
                    }
                    imagePaths.push(path)
                }


            }
            console.log(imagePaths)

            formats = JSON.parse(formats)
            const stockStatus = formats?.physical?.stock < 10 ? "Hurry Up" : "In Stock"
            const newBook = {
                ISBN,
                title,
                author,
                category,
                language,
                description,
                publicationDate,
                images: imagePaths,
                formats: formats,
                stockStatus
            }
            const book = await Book.create(newBook)

            res.status(201).json({ message: "Book created successfully", book })
        } catch (err) {
            res.status(500).json({ message: "Somthing went wrong" }) 
        }
    },
    async getAllBooks(req, res) {
        try {
            let { page, limit, name } = req.query
            console.log(req.query)
            const query = {};

            if (name) {
                query.title = { $regex: new RegExp(name, "i") };
            }
            page = parseInt(page)
            limit = parseInt(limit)
            let skip = (page - 1) * limit
            const allBooks = await Book.find(query).skip(skip).limit(limit).populate("category").populate("appliedOffer")
            const totalBooks = await Book.countDocuments({})

            res.status(200).json({ success: true, allBooks: allBooks, totalBooks });
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Something went wrong" })
        }
    },
    async getBooksByFilter(req, res) {
        try {
            let { page, limit, sortBy, price, category } = req.query
            console.log(req.query)
            page = parseInt(page) || 1
            limit = parseInt(limit) || 10
            let skip = (page - 1) * limit


            let sort = {}
            if (sortBy == "Newness") {
                sort.publicationDate = 1
            } else if(sortBy == "Average rating"){
                sort.averageRating=-1
            }else if (sortBy == "Price: High to Low") {
                sort = { "formats.physical.price": -1 }
            } else if (sortBy == "Price: Low to High") {
                sort = { "formats.physical.price": 1 }
            } else if (sortBy == "A-Z") {
                sort.title = 1
            } else if (sortBy == "Z-A") {
                sort.title = -1
            }

            console.log(sort, price)
            let find = { isDeleted: false, "formats.physical.stock": { $gt: 0 } }

            if (price != "{}") {
                price = JSON.parse(price)
                find = { ...find, "formats.physical.price": price }
            }
            let allBooks = await Book.find(find).skip(skip).limit(limit).populate('category').populate("appliedOffer")
                .sort(sort)

            let totalBooks = await Book.countDocuments({...find})
            if (category != "All") {
                
                allBooks = allBooks.filter((book) => {
                    return book.category.name == category
                })
                totalBooks=allBooks.length
              
            }
            
           
            res.status(200).json({ success: true, books: allBooks, totalBooks });
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Something went wrong" })
        }
    },
    async editBook(req, res) {
        try {
            const { bookId } = req.params
            const { ISBN, title, author, category, language, description, publicationDate, formats } = req.body;

            let stockStatus = null
            const stock = formats.physical.stock
            if (stock == 0) {
                stockStatus = "Stock Out"
            } else if (stock < 10) {
                stockStatus = "Hurry Up"
            } else {
                stockStatus = "In Stock"
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
                stockStatus
            }

            const book = await Book.updateOne({ _id: bookId }, { $set: newBook }, { new: true });
            res.status(200).json({ message: "Book updated successfully", book })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Somthing went wrong" })
        }
    },
    async getBookData(req, res) {
        try {

            const { bookId } = req.params
            let book = await Book.findOne({ _id: bookId }).populate("category").populate("appliedOffer")
            res.status(200).json({ success: true, bookData: book })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Somthing went wrong" })
        }
    },
    async handleBookDelete(req, res) {
        try {
            console.log("togle -delte")
            const { bookId } = req.params
            const book = await Book.findOne({ _id: bookId })
            if (!book) {
                return res.status(404).json({ message: "No such Book Found" })
            }
            book.isDeleted = !book.isDeleted
            await book.save()
            res.status(200).json({ success: true })
        } catch (err) {
            res.status(500).json({ message: "Something went wrong" })
        }
    },
    async getJustPublishedBooks(req, res) {
        try {
            const books = await Book.find({ isDeleted: false, "formats.physical.stock": { $gt: 0 } }).populate("appliedOffer")
                .sort({ createdAt: -1 }).limit(8)
            res.status(200).json({ books: books })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Something Went Wrong" })
        }
    },
    async getRelatedBooks(req, res) {
        try {
            const { tags } = req.body
            const { bookId } = req.params
            console.log(tags, bookId)
            const books = await Book.find({
                _id: { $ne: bookId },
                $or: tags,
                isDeleted: false,
                "formats.physical.stock": { $gt: 0 }
            }).populate("appliedOffer").limit(8)
            console.log(books)
            res.status(200).json({ books: books })

        } catch (err) {
            console.log(err)
            res.status(404).json({ message: "Something went wrong while listing related Books" })
        }
    },
    async updateBookImage(req, res) {
        try {
            const { bookId } = req.params
            const { oldUrl } = req.body

            const updatingBook = await Book.findOne({ _id: bookId })
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cldRes = await handleUpload(dataURI)

            const images = [...updatingBook.images]
            const newImages = []
            for (let i = 0; i < images.length; i++) {
                const image = images[i]
                console.log(image.secure_url, oldUrl)
                if (image.secure_url == oldUrl) {
                    deleteImage(image.public_id)
                    const newIMG = {
                        secure_url: cldRes.secure_url,
                        public_id: cldRes.public_id
                    }
                    newImages.push(newIMG)
                } else {
                    newImages.push(image)
                }

            }

            updatingBook.images = newImages
            await updatingBook.save()


            res.status(200).json({ message: "Successfully Updated", newImages })
        } catch (err) {
            console.log(err)
            res.status(400).json("Something Went Wrong While Updating Image ")
        }
    },
    async searchProducts(req, res) {
        try {

            const { title } = req.query
            if (title.trim() == "") {
                return res.status(200).json({ products: [] })
            }
            const products = await Book.find({ title: { $regex: title, $options: "i" } })
            console.log(products)
            res.status(200).json({ products: products })
        } catch (error) {
            res.status(400).json({ message: "Somthing went Wrong" })
        }
    },
    async addReview(req, res) {
        try {
            const { userId, bookId } = req.params
            const { rating, reviewText } = req.body
            console.log(rating, reviewText)

            let cldRes
            if (req.file) {
                const b64 = Buffer.from(req.file.buffer).toString("base64");
                let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
                cldRes = await handleUpload(dataURI)
            }
            await Review.create({
                rating,
                reviewText,
                userId,
                bookId,
                image: {
                    secure_url: cldRes?.secure_url,
                    public_id: cldRes?.public_id
                }
            })

            const reviews = await Review.find({ bookId })
            const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0)
            const averageRating = totalRatings / reviews.length
            await Book.findByIdAndUpdate(
                bookId,
                {
                    $set: {
                        averageRating
                    }
                }
            )

            res.status(200).json({ success: true })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, message: error.messagem || "Something Went Wrong" })
        }
    },
    async removeReview(req, res) {
        try {
            const { reviewId } = req.params
            console.log(reviewId)
            const deletedReview = await Review.findOneAndDelete({ _id: reviewId })
            if (deletedReview && deletedReview?.image?.public_id) {
                deleteImage(deletedReview.image.public_id)
            }
            res.status(200).json({ success: true })
        } catch (err) {
            console.log(err)
            res.status(400).json({ message: err?.message || "Something Went Wrong" })
        }
    },
    async getBookReview(req, res) {
        try {
            const { bookId } = req.params
            const reviews = await Review.find({ bookId }).populate("userId")
            res.status(200).json({ success: true, reviews: reviews ? reviews : [] })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, message: error.message || "Something Went Wrong" })
        }
    },
    async getShowcaseData(req, res) {
        try {
            const books = await Book.find({"formats.physical.price": {$ne: 0}}).populate("category");
    
            const categories = ["Finance", "Self-Help", "Fiction" ,"Non-Fiction"]
    

            const showcaseData = categories.map((categoryTitle) => {
                const categoryBooks = books.filter(book => book.category.name === categoryTitle);
    
                const products = categoryBooks.map(book => ({
                    _id:book._id,
                    images: book.images, 
                    title: book.title, 
                    formats:book.formats,
                    appliedOffer:book.appliedOffer
                }));
    
                return {
                    title: categoryTitle,
                    products: products
                };
            });
             console.log(showcaseData)
            res.status(200).json({showcaseData:showcaseData})
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching showcase data" });
        }
    }
    
}