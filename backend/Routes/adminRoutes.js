const express= require('express')
const { adminLogin, checkAuth } = require('../controller/adminController')


const router = express.Router()

router.post('/login',adminLogin)


module.exports=router  