const express= require('express')
const upload = require('../utils/multer')
const { createBook, getAllBooks, getBookData, editBook, handleBookDelete, getJustPublishedBooks, getRelatedBooks } = require('../controller/BookConroller')
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
router.put('/:bookId/toggle-delete',handleBookDelete)

router.get('/list/just-published',getJustPublishedBooks) 
router.post('/list/related-books/:bookId',getRelatedBooks)
module.exports=router 