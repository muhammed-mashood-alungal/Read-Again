const express= require('express')
const { getUserOrders, updateOrderStatus, getAllOrders, placeOrder, cancelOrder, requestReturnOrder } = require('../controller/orderController')
const router = express.Router()

router.get('/',getAllOrders)
router.post('/:userId/place-order',placeOrder)
router.get('/:userId',getUserOrders)
router.put('/orderId/update-order-status',updateOrderStatus)
router.put('/:orderId/cancel-order',cancelOrder)
router.put('/:orderId/request-return-order',requestReturnOrder)
module.exports=router     