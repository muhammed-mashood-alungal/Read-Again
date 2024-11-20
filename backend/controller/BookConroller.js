const Book = require("../models/Books");
const fs = require('fs')
const path = require('path')
module.exports = {
    async createBook(req, res) {
        try {
            const { ISBN, title, author, category, genre, description, publicationDate, formats } = req.body;

            const imagePaths = [];
            for (let i = 1; i <= 5; i++) {
                const field = `image-${i}`;
                if (req.files[field]) {
                    req.files[field].forEach(file => imagePaths.push(file.filename));
                }
            }

            const newBook = {
                ISBN,
                title,
                author,
                category,
                genre,
                description,
                publicationDate,
                images: imagePaths,
                formats: JSON.parse(formats)
            };
            console.log(newBook)

            const book = await Book.create(newBook);

            const oldPath = path.join(__dirname, '..', `public/images/books/${book.ISBN}`);
            const newPath = path.join(__dirname, '..', `public/images/books/${book._id}`);
            console.log(oldPath, newPath)
            if (fs.existsSync(oldPath)) {
                console.log("exists")
                fs.renameSync(oldPath, newPath);
            }

            res.status(201).json({ message: "Book created successfully", book })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Somthing went wrong" })
        }
    },
    async getAllBooks(req, res) {
        try {
            let { page, limit } = req.query
            console.log(req.query)
            page = parseInt(page)
            limit = parseInt(limit)
            let skip = (page - 1) * limit
            console.log(skip, limit)
            const allBooks = await Book.find({}).skip(skip).limit(limit)
            const totalBooks = await Book.countDocuments({})

            res.status(200).json({ success: true, allBooks: allBooks, totalBooks });
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Somthing went wrong" })
        }
    },
    async editBook(req, res) {
        try {
            console.log("healsdf", req.params.bookId)
            const { bookId } = req.params
            const { ISBN, title, author, category, genre, description, publicationDate, formats } = req.body;


            const newBook = {
                ISBN,
                title,
                author,
                category,
                genre,
                description,
                publicationDate,
                formats: formats
            };
            console.log(newBook)

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
            console.log(bookId)
            const bookData = await Book.findOne({ _id: bookId })
            res.status(200).json({ success: true, bookData })
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
            const books = await Book.find({}).sort({ createdAt: -1 }).limit(10)
            res.status(200).json({ books: books })
        } catch (err) {
            console.log("asdfasdfasf")
            console.log(err)
            res.status(500).json({ message: "Something Went Wrong" })
        }
    },
    async getRelatedBooks(req,res){
        try{
            const {tags}  = req.body
            const {bookId} = req.params
            console.log(tags,bookId)
           const books = await Book.find({
            _id:{$ne:bookId},
            $or:tags
           }).limit(8)
           console.log(books)
           res.status(200).json({ books: books })

        }catch(err){
           console.log(err)
           res.status(404).json({message:"Something went wrong while listing related Books"})
        }
    }
}