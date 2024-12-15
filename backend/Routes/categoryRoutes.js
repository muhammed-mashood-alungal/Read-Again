const express= require('express')
const { addCategory, updateCategory, getAllCategories, getCategoryData, getListedCategories } = require('../controller/categoryController')
const { listOrUnlistCategory } = require('../controller/categoryController')
//const upload = require('../utils/multer')
const { isAdmin } = require('../middlewares/auth')
const multer = require('multer')
const router = express.Router()

const storage = new multer.memoryStorage();
const upload = multer({
  storage
});

router.get('/',isAdmin,getAllCategories)
router.get('/listed',getListedCategories)
router.post('/create',  upload.single("image"),isAdmin ,addCategory)
router.put('/:categoryId/edit',upload.single("image"),isAdmin ,updateCategory)
router.get('/:categoryId',getCategoryData)
router.put('/:categoryId/list-or-unlist',isAdmin,listOrUnlistCategory)

module.exports=router