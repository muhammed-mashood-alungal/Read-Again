const express= require('express')
const { checkAuth } = require('../controller/adminController')
const { logout } = require('../controller/userController')


const router = express.Router()

router.get('/check-auth',checkAuth)
router.get('/logout',logout)


module.exports=router 