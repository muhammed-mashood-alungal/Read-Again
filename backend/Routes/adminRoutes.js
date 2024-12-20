const express= require('express')
const { adminLogin, checkAuth, getSalesReport, getOverallStates, topSelling } = require('../controller/adminController')
const { isAdmin } = require('../middlewares/auth');

const router = express.Router()

router.post('/login',adminLogin)
router.post('/sales-report/:filterType',isAdmin,getSalesReport)
router.get('/overall-stats',isAdmin,getOverallStates)
router.get('/top-selling',isAdmin,topSelling) 

module.exports=router  