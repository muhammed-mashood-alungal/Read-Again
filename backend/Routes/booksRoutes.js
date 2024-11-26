const express= require('express')
const upload = require('../utils/multer')
const { createBook, getAllBooks, getBookData, editBook, handleBookDelete, getJustPublishedBooks, getRelatedBooks, updateBookImage, getListedBooks } = require('../controller/bookController')
const { isAdmin, protect } = require('../middlewares/auth')
const router = express.Router()


router.get('/:bookId',getBookData)
router.post('/create',upload.fields([
  {name:'image-1'},
  {name:'image-2'},
  {name:'image-3'},
  {name:'image-4'},
  {name:'image-5'}
]),createBook)
 
router.put('/:bookId/edit',editBook)  
router.get('/',getAllBooks) 
router.get('/listed',getListedBooks) 
router.put('/:bookId/toggle-delete',handleBookDelete)
router.put(
  '/update-book-image/:bookId',
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
router.get('/list/just-published',getJustPublishedBooks) 
router.post('/list/related-books/:bookId',getRelatedBooks)
module.exports=router 