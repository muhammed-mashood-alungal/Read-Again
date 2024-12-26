const express = require('express')
const { getUserOrders,
    getAllOrders,
    placeOrder,
    cancelOrder,
    requestReturnOrder,
    approveReturnRequest,
    rejectReturnRequest,
    changeStatus,
    cancelOrderItem,
    returnOrderItem,
    approveItemReturn,
    rejectItemReturn,
    paymentSuccess,
    getOrderData } = require('../controller/orderController')
const { isAdmin, protect } = require('../middlewares/auth')
const router = express.Router()

router.get('/', isAdmin, getAllOrders)
router.post('/:userId/place-order', protect,placeOrder)
router.get('/:orderId/order-data', getOrderData)
router.get('/:userId', protect,getUserOrders)
router.put('/:orderId/change-status/:status', changeStatus)
router.put('/:orderId/cancel-order',protect, cancelOrder)
router.put('/:orderId/request-return-order',protect, requestReturnOrder)
router.put('/:orderId/approve-return-request', isAdmin, approveReturnRequest)
router.put('/:orderId/reject-return-request', isAdmin, rejectReturnRequest)
router.put('/:orderId/items/:itemId/cancel', cancelOrderItem)
router.put('/:orderId/items/:itemId/return', returnOrderItem)
router.put('/:orderId/items/:itemId/approve-return', isAdmin, approveItemReturn)
router.put('/:orderId/items/:itemId/reject-return', isAdmin, rejectItemReturn)
router.patch('/:orderId/payment-success', paymentSuccess)

module.exports = router     