const express= require('express')
const upload = require('../utils/multer')
const { createBook, getAllBooks, getBookData, editBook, handleBookDelete } = require('../controller/BookConroller')
const router = express.Router()

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
router.get('/:bookId',getBookData) 
module.exports=router 