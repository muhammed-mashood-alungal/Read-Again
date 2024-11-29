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
            let { page, limit, name } = req.query
            console.log(req.query)
            const query = {};

            if (name) {
                query.title = { $regex: new RegExp(name, "i") };
            }
            page = parseInt(page)
            limit = parseInt(limit)
            let skip = (page - 1) * limit
            console.log(skip, limit)
            const allBooks = await Book.find(query).skip(skip).limit(limit).populate("category")
            const totalBooks = await Book.countDocuments({})

            res.status(200).json({ success: true, allBooks: allBooks, totalBooks });
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Something went wrong" })
        }
    },
    async getBooksByFilter(req, res) {
        try {
            let { page, limit , sortBy , price , category } = req.query
            console.log(req.query)  
            page = parseInt(page) || 1
            limit = parseInt(limit) || 10
            let skip = (page - 1) * limit
           
           
            let sort =  { }
            if(sortBy == "Newness"){
               sort.publicationDate = 1
            }else if(sortBy == "Price: High to Low"){
               sort={"formats.physical.price":-1}
            
            }else if(sortBy == "Price: Low to High"){
                sort={"formats.physical.price":1}
            }else if (sortBy == "A-Z"){
                sort.title=1
            }else if (sortBy == "Z-A"){
                sort.title = -1
            }
            
            console.log(sort,price)  
            const priceRange= {}
            let  find = {isDeleted : false } 
            if(price  != "{}"){
                price = price ? JSON.parse(price) : {}
                find ={...find,"formats.physical.price":price}
            }
            
            console.log(find)
            let allBooks = await Book.find(find).skip(skip).limit(limit).populate('category')
            .sort(sort)
            if(category != "All"){
                allBooks = allBooks.filter((book)=>{
                  return book.category.name == category
                })
            }
            console.log(allBooks[0])



            const totalBooks = await Book.countDocuments({})

            res.status(200).json({ success: true, books: allBooks, totalBooks });
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
            const bookData = await Book.findOne({ _id: bookId }).populate("category")
            console.log(bookData?.formats?.physical?.price)
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
            const books = await Book.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(10)
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
                isDeleted: false
            }).limit(8)
            console.log(books)
            res.status(200).json({ books: books })

        } catch (err) {
            console.log(err)
            res.status(404).json({ message: "Something went wrong while listing related Books" })
        }
    },
    async updateBookImage(req, res) {
        try {
            console.log("update controller")
            const { bookId } = req.params
            const { oldUrl } = req.body
            console.log(req.file.filename)
            console.log("old url", oldUrl)
            const updatingBook = await Book.findOne({ _id: bookId })

            const oldPath = path.join(__dirname, '..', `public/images/books/${updatingBook._id}/${oldUrl}`);
            if (fs.existsSync(oldPath)) {
                console.log("file exists")
                fs.unlinkSync(oldPath)
            }
            const images = [...updatingBook.images]
            console.log("old")
            console.log(images)
            const newImages = images.map((image, index) => {
                console.log(image, oldUrl)
                if (image == oldUrl) {
                    return req?.file?.filename
                } else {
                    return image
                }
            })
            console.log("new")
            console.log(newImages)
            updatingBook.images = newImages
            await updatingBook.save()


            res.status(200).json({ message: "Successfully Updated", newImages })
        } catch (err) {
            console.log(err)
            res.status(400).json("Something Went Wrong While Updating Image ")
        }
    }
}