const express= require('express')
const { addCategory, getAllCategories, getCategoryData, updateCategory } = require('../controller/adminController')
const upload = require('../utils/multer')
const { listOrUnlistCategory } = require('../controller/userController')
const { createBook } = require('../controller/BookConroller')
const router = express.Router()

router.post('/categories/create', upload.single("image") ,addCategory)
router.put('/categories/:categoryId/edit', upload.single("image") ,updateCategory)
router.get('/categories',getAllCategories)
router.get('/categories/:categoryId',getCategoryData)
router.put('/categories/:categoryId/list-or-unlist',listOrUnlistCategory)

router.post('/books/create',createBook)

module.exports=router 