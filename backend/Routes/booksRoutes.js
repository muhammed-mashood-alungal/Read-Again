const express= require('express')
const upload = require('../utils/multer')
const { createBook, getAllBooks, getBookData, editBook, handleBookDelete, getJustPublishedBooks, getRelatedBooks, updateBookImage, getListedBooks, getAllBooksByFilter, getBooksByFilter } = require('../controller/bookController')
const { isAdmin, protect } = require('../middlewares/auth')
const router = express.Router()


router.get('/:bookId',getBookData)
router.post('/create',isAdmin,upload.fields([
  {name:'image-1'},
  {name:'image-2'},
  {name:'image-3'},
  {name:'image-4'},
  {name:'image-5'}
]),createBook)
 
router.put('/:bookId/edit',isAdmin,editBook)  
router.get('/',isAdmin,getAllBooks)
router.get('/list/filtered-books',getBooksByFilter) 
router.put('/:bookId/toggle-delete',isAdmin,handleBookDelete)
router.put(
  '/update-book-image/:bookId',
  isAdmin,
  upload.single('image'),
  (err, req, res, next) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: err.message });
    }
    next();
  },
  updateBookImage
);
router.get('/list/just-published',isAdmin,getJustPublishedBooks) 
router.post('/list/related-books/:bookId',isAdmin,getRelatedBooks)
module.exports=router 