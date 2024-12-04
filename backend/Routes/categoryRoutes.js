const express= require('express')
const { addCategory, updateCategory, getAllCategories, getCategoryData, getListedCategories } = require('../controller/categoryController')
const { listOrUnlistCategory } = require('../controller/userController')
const upload = require('../utils/multer')
const { isAdmin } = require('../middlewares/auth')
const router = express.Router()

router.get('/',isAdmin,getAllCategories)
router.get('/listed',getListedCategories)
router.post('/create',  upload.single("image"),isAdmin ,addCategory)
router.put('/:categoryId/edit',upload.single("image"),isAdmin ,updateCategory)
router.get('/:categoryId',getCategoryData)
router.put('/:categoryId/list-or-unlist',isAdmin,listOrUnlistCategory)

module.exports=router