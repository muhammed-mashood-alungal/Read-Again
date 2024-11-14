const express= require('express')
const { addCategory, getAllCategories, getCategoryData, updateCategory, adminLogin } = require('../controller/adminController')
const upload = require('../utils/multer')
const { listOrUnlistCategory } = require('../controller/userController')
const { createBook } = require('../controller/BookConroller')
const { protect, isAdmin } = require('../middlewares/auth')
const router = express.Router()

router.post('/login',adminLogin)

router.post('/categories/create',  upload.single("image") ,addCategory)
router.put('/categories/:categoryId/edit',upload.single("image") ,updateCategory)
router.get('/categories',getAllCategories)
router.get('/categories/:categoryId',getCategoryData)
router.put('/categories/:categoryId/list-or-unlist',listOrUnlistCategory)


module.exports=router 