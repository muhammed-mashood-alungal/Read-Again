const express= require('express')
<<<<<<< HEAD
const { addCategory, getAllCategories, getCategoryData, updateCategory, adminLogin } = require('../controller/adminController')
const upload = require('../utils/multer')
const { listOrUnlistCategory } = require('../controller/userController')
const { createBook } = require('../controller/BookConroller')
const { protect, isAdmin } = require('../middlewares/auth')
const router = express.Router()

router.post('/login',adminLogin)

router.post('/categories/create',protect,isAdmin, upload.single("image") ,addCategory)
router.put('/categories/:categoryId/edit', protect,isAdmin,upload.single("image") ,updateCategory)
router.get('/categories',getAllCategories)
router.get('/categories/:categoryId',protect,isAdmin,getCategoryData)
router.put('/categories/:categoryId/list-or-unlist',protect,isAdmin,listOrUnlistCategory)
=======
const { adminLogin, checkAuth } = require('../controller/adminController')


const router = express.Router()

router.post('/login',adminLogin)
>>>>>>> dc5bdfea52910490befd6242471e3f6164bc8958


module.exports=router 