const express= require('express')
const { addCategory, updateCategory, getAllCategories, getCategoryData, getListedCategories } = require('../controller/categoryController')
const { listOrUnlistCategory } = require('../controller/userController')
const upload = require('../utils/multer')
const router = express.Router()

router.get('/',getAllCategories)
router.get('/listed',getListedCategories)
router.post('/create',  upload.single("image") ,addCategory)
router.put('/:categoryId/edit',upload.single("image") ,updateCategory)
router.get('/:categoryId',getCategoryData)
router.put('/:categoryId/list-or-unlist',listOrUnlistCategory)

module.exports=router