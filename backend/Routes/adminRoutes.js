const express= require('express')
const { adminLogin, checkAuth, getSalesReport, getOverallStates } = require('../controller/adminController')


const router = express.Router()

router.post('/login',adminLogin)
router.post('/sales-report/:filterType',getSalesReport)
router.get('/overall-stats',getOverallStates)

module.exports=router  