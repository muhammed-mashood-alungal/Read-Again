const express= require('express')
const upload = require('../utils/multer')
<<<<<<< HEAD
const { createBook, getAllBooks, getBookData, editBook, handleBookDelete, getJustPublishedBooks, getRelatedBooks } = require('../controller/BookConroller')
=======
const { createBook, getAllBooks, getBookData, editBook, handleBookDelete, getJustPublishedBooks, getRelatedBooks, updateBookImage, getListedBooks } = require('../controller/bookController')
>>>>>>> dc5bdfea52910490befd6242471e3f6164bc8958
const { isAdmin, protect } = require('../middlewares/auth')
const router = express.Router()


router.get('/:bookId',getBookData)
<<<<<<< HEAD
router.post('/create',protect,isAdmin,upload.fields([
=======
router.post('/create',upload.fields([
>>>>>>> dc5bdfea52910490befd6242471e3f6164bc8958
  {name:'image-1'},
  {name:'image-2'},
  {name:'image-3'},
  {name:'image-4'},
  {name:'image-5'}
]),createBook)
 
router.put('/:bookId/edit',protect,isAdmin,editBook)  
router.get('/',getAllBooks) 
<<<<<<< HEAD
router.put('/:bookId/toggle-delete',isAdmin,handleBookDelete)

=======
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
>>>>>>> dc5bdfea52910490befd6242471e3f6164bc8958
router.get('/list/just-published',getJustPublishedBooks) 
router.post('/list/related-books/:bookId',getRelatedBooks)
module.exports=router 