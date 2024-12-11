const express= require('express')
const { adminLogin, checkAuth, getSalesReport } = require('../controller/adminController')


const router = express.Router()

router.post('/login',adminLogin)
router.post('/sales-report/:filterType',getSalesReport)


module.exports=router  