const express = require('express')
const upload = require('../utils/multer')
const { createBook, getAllBooks, getBookData, editBook, handleBookDelete, getJustPublishedBooks, getRelatedBooks, updateBookImage, getListedBooks, getAllBooksByFilter, getBooksByFilter, searchProducts, addReview, removeReview, getBookReview } = require('../controller/bookController')
const { isAdmin } = require('../middlewares/auth');
const router = express.Router()




router.get('/search', searchProducts)
router.get('/:bookId', getBookData)
router.post('/create', isAdmin,upload.array('images'), createBook)
router.put('/:bookId/edit', isAdmin, editBook)
router.get('/', isAdmin, getAllBooks)
router.get('/list/filtered-books', getBooksByFilter)
router.put('/:bookId/toggle-delete', isAdmin, handleBookDelete)
router.put('/update-book-image/:bookId',isAdmin,upload.single('image'),updateBookImage);
router.get('/list/just-published', getJustPublishedBooks)
router.post('/list/related-books/:bookId', getRelatedBooks)
router.post('/:bookId/reviews/add/:userId',upload.single("reviewImage"),addReview) 
router.delete('/reviews/:reviewId/remove',removeReview)
router.get('/:bookId/reviews',getBookReview)

module.exports = router 