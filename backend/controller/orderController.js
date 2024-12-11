const Address = require("../models/Address")
const Book = require("../models/Books")
const Cart = require("../models/Cart")
const Order = require("../models/Order")
const jwt = require("jsonwebtoken")
const User = require("../models/Users")
const Coupon = require("../models/Coupon")
const Wallet = require("../models/Wallet")
const Transaction = require("../models/WalletTransactions")

module.exports = {
    async placeOrder(req, res) {
        try {
            const { userId } = req.params
            const orderDetails = req.body
            const { city, landmark, district, state, country, postalCode, phoneNumbers } = await Address.findOne({ userId, isDefault: true })
            const shippingAddress = `${city},Near ${landmark},${district},${state},${country},${postalCode}
                                     ,${phoneNumbers[0]} & ${phoneNumbers[1] && phoneNumbers[1]}`

            console.log(orderDetails.coupon)
            if (orderDetails.coupon) {

                const couponData = await Coupon.findOne({ code: orderDetails.coupon })
                console.log(couponData.currentUsage, couponData.maxUsage)
                if (!couponData || !couponData.isActive || couponData.currentUsage >= couponData.maxUsage) {
                    return res.status(400).json({ success: false, message: `The ${orderDetails.coupon} Coupon No Longer Available.` })
                } else {
                    couponData.currentUsage += 1
                    await couponData.save()
                    console.log("coupon Data +============")
                    console.log(couponData)
                    orderDetails.coupon = couponData._id
                }
            } else {
                console.log("dleting")
                delete orderDetails.coupon
            }
            const response = await Order.create({ userId, ...orderDetails, shippingAddress })
            console.log("response 0))))))))9000000000000000000000000000000")
            console.log(response)
            for (let i = 0; i < orderDetails.items.length; i++) {
                const book = await Book.findOne({ _id: orderDetails.items[i].bookId, isDeleted: false })

                if (!book) {
                    return res.status(400).json({ success: false, message: `Some Books are No Longer Available.` })
                }
                if (book.formats.physical.stock < orderDetails.items[i].quantity) {
                    return res.status(400).json({ success: false, message: `${book.title} Have not much Stock` })
                }
                book.formats.physical.stock = book?.formats?.physical?.stock - orderDetails.items[i].quantity
                console.log(book.formats.physical.stock, orderDetails.items[i].quantity)

                if (book.formats.physical.stock == 0) {
                    book.stockStatus = "Out Of Stock"
                } else if (book.formats.physical.stock < 10) {
                    book.stockStatus = "Hurry Up"
                } else {
                    book.stockStatus = "In Stock"
                }
                book.save()
            }
            //consider the buynow case deleting later
            await Cart.deleteOne({ userId })
            const user = await User.findOne({ _id: userId })
            res.status(200).json({ success: true, orderId: response._id, user })
        } catch (err) {
            console.log(err)
            res.status(400).json({ success: false, message: "Order Placing Failed Please try Again" })
        }
    },
    async changeStatus(req, res) {
        try {

            const { orderId, status } = req.params
            console.log(orderId, status)
            const order = await Order.findOneAndUpdate({ _id: orderId }, {
                $set: {
                    orderStatus: status
                }
            })

            order.items = order.items.map((item) => {
                console.log(item.status)
                if(item.status != "Canceled"){
                    item.status = status
                }
                //item.status =  (status == "Canceled") ? "Canceled" : status
                console.log(item.status)
                return item
            })
            order.save()
            res.status(200).json({ success: true })
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ message: 'Somthing went wrong while changing order status' })
        }
    },
    async getUserOrders(req, res) {
        try {
            const { userId } = req.params
            const orders = await Order.find({ userId }).sort({ orderDate: -1 }).populate("items.bookId").populate("userId")
            res.status(200).json({ success: true, orders })
        } catch (err) {
            console.log(err)
            res.status(400).json({ success: false })
        }
    },
    async getAllOrders(req, res) {
        try {
            let { page, limit } = req.query
            page = parseInt(page)
            limit = parseInt(limit)
            let skip = (page - 1) * limit

            const orders = await Order.find({}, {
                password: 0
            }).skip(skip).limit(limit).populate("items.bookId").populate("userId")
            const totalUsers = await Order.countDocuments({})
            res.status(200).json({ success: true, orders, totalUsers })
        } catch (err) {
            console.log(err)
            res.status(400).json({ success: false })
        }
    },
    async cancelOrder(req, res) {
        try {

            const { orderId } = req.params
            const { cancellationReason } = req.body
            const order = await Order.findOne({ _id: orderId })
            order.orderStatus = "Canceled"
            order.cancelReason = cancellationReason
            for (const item of order.items) {
                item.status = "Canceled";
                item.reason = cancellationReason
                const book = await Book.findOne({ _id: item.bookId });
                if (book) {
                    book.formats.physical.stock += item.quantity;
                    await book.save();
                }
            }

            console.log(order.paymentStatus)
            if (order.paymentStatus == "Success") {
                const amount = order.totalAmount
                const userWallet = await Wallet.findOneAndUpdate({ userId: order.userId }, {
                    $inc: {
                        balance: amount
                    }
                }, { upsert: true, new: true })
                await Transaction.create({
                    userId: order.userId,
                    walletId: userWallet._id,
                    type: 'credit',
                    amount: amount,
                    associatedOrder: order._id
                })
            }
            order.paymentStatus = "Refunded"
            await order.save()
            res.status(200).json({ success: true })
        } catch (err) {
            console.log(err)
            res.status(400).json({ message: "Something Went Wrong" })
        }
    },
    async requestReturnOrder(req, res) {
        try {
            const { orderId } = req.params
            const { returnReason } = req.body
            console.log(returnReason)
            const order = await Order.findOne({ _id: orderId })
            order.orderStatus = "Return Requested"
            order.returnReason = returnReason
            for (const item of order.items) {
                item.status = "Return Requested";
                const book = await Book.findOne({ _id: item.bookId });
                if (book) {
                    await book.save();
                }
            }
            await order.save()
            res.status(200).json({ success: true })
        } catch (err) {
            console.log(err)
            res.status(400).json({ message: "Something Went Wrong" })
        }
    },
    async approveReturnRequest(req, res) {
        try {
            const { orderId } = req.params
            const order = await Order.findOneAndUpdate({ _id: orderId }, {
                $set: {
                    orderStatus: "Returned"
                }
            }, { new: true })

            for (const item of order.items) {
                item.status = "Returned";
                
            }

            if (order.paymentStatus == "Success") {
                const amount = order.totalAmount
                const userWallet = await Wallet.findOneAndUpdate({ userId: order.userId }, {
                    $inc: {
                        balance: amount
                    }
                }, { upsert: true, new: true })
                console.log(userWallet)
                await Transaction.create({
                    userId: order.userId,
                    walletId: userWallet._id,
                    type: 'credit',
                    amount: amount,
                    associatedOrder: order._id
                })
            }
            order.paymentStatus = "Refunded"
            res.status(200).json({ success: true })
        } catch {
            console.log(err)
            res.status(400).json({ message: "Something Went Wrong While Returning Order" })
        }
    },
    async rejectReturnRequest(req, res) {
        try {
            const { orderId } = req.params
            await Order.findOneAndUpdate({ _id: orderId }, {
                $set: {
                    isRejectedOnce: true,
                    orderStatus: "Delivered",
                    paymentStatus: "Success"
                }
            })
            res.status(200).json({ success: true })
        } catch {
            console.log(err)
            res.status(400).json({ message: "Something Went Wrong While Rejecting Return Order" })
        }
    },
    async cancelOrderItem(req, res) {
        try {
            const { orderId, itemId } = req.params
            const { cancellationReason } = req.body
            const order = await Order.findOne({ _id: orderId })
            for (let i = 0; i < order.items.length; i++) {
                if (order.items[i].bookId == itemId) {
                    order.items[i].status = "Canceled"
                    order.items[i].reason = cancellationReason
                    const book = await Book.findOne({ _id: itemId })
                    book.formats.physical.stock += order.items[i].quantity
                    await book.save()
                   
                    if (order.paymentStatus == "Success") {
                        const orderTotal = order.totalAmount
                        const itemTotal = order.items[i].totalPrice
                        const coupon = order.coupon
                        let amount = itemTotal
                        if (coupon) {
                            const couponData = await Coupon.findOne({ _id: coupon })
                            const percentage = couponData.discountValue
                            let orderTotalWithoutDiscount = orderTotal / (1 - percentage / 100)
                            orderTotalWithoutDiscount = orderTotalWithoutDiscount.toFixed()
                            console.log("orderTotalWithoutDiscount  ", orderTotalWithoutDiscount)
                            const totalOrderDiscount = orderTotalWithoutDiscount - orderTotal
                            const proptionalDiscount = itemTotal / orderTotalWithoutDiscount * totalOrderDiscount
                            amount = itemTotal - proptionalDiscount.toFixed()
                        }
                        const userWallet = await Wallet.findOneAndUpdate({ userId: order.userId }, {
                            $inc: {
                                balance: amount
                            }
                        }, { upsert: true, new: true })
                        console.log(userWallet)
                        await Transaction.create({
                            userId: order.userId,
                            walletId: userWallet._id,
                            type: 'credit',
                            amount: amount,
                            associatedOrder: order._id
                        })
                    }
                    break;
                    order.totalAmount = order.totalAmount - order.items[i].totalPrice
                }
            }

            const itemStatuses = order.items.map(item => item.status)
            const isAllItemsCancelled = itemStatuses.every((status) => status == "Canceled")
            if (isAllItemsCancelled) {
                order.orderStatus = "Canceled"
                order.cancellationReason = "All Items Are Cancelled"
            }
            await order.save()

            res.status(200).json({ success: true, isAllItemsCancelled })
        } catch (err) {
            console.log(err)
            res.status(400).json({ success: false, message: "Something Went Wrong While Canceling This Item" })
        }
    },
    async returnOrderItem(req, res) {
        try {
            console.log("returning order")
            const { orderId, itemId } = req.params
            const { returnReason } = req.body
            const order = await Order.findOne({ _id: orderId })
            for (let i = 0; i < order.items.length; i++) {
                if (order.items[i].bookId == itemId) {
                    console.log("Done")
                    order.items[i].status = "Return Requested"
                    order.items[i].reason = returnReason
                    // const book=await Book.findOne({_id:itemId})
                    // book.formats.physical.stock += order.items[i].quantity
                    // await book.save()
                    // break;
                }
            }
            // const itemStatuses = order.items.map(item=>item.status)
            // const isAllItemsCancelled = itemStatuses.every((status)=>status == "Canceled")
            // if(isAllItemsCancelled){
            //     order.orderStatus = "Canceled"
            //     order.cancellationReason = "All Items Are Cancelled"
            // }
            await order.save()
            res.status(200).json({ success: true })
        } catch (err) {
            console.log(err)
            res.status(400).json({ success: false, message: "Something Went Wrong While Canceling This Item" })
        }
    },
    async approveItemReturn(req, res) {
        try {
            const { orderId, itemId } = req.params
            console.log(itemId, orderId)
            const order = await Order.findOne({ _id: orderId })
            for (let i = 0; i < order.items.length; i++) {
                if (order.items[i].bookId == itemId) {
                    order.items[i].status = "Returned"
                    const book = await Book.findOne({ _id: itemId })
                    book.formats.physical.stock += order.items[i].quantity
                    await book.save()
                
                    if (order.paymentStatus == "Success") {
                        const orderTotal = order.totalAmount
                        const itemTotal = order.items[i].totalPrice
                        const coupon = order.coupon
                        let amount = itemTotal
                        if (coupon) {
                            const couponData = await Coupon.findOne({ _id: coupon })

                            const percentage = couponData.discountValue
                            let orderTotalWithoutDiscount = orderTotal / (1 - percentage / 100)
                            orderTotalWithoutDiscount = orderTotalWithoutDiscount.toFixed()
                            const totalOrderDiscount = orderTotalWithoutDiscount - orderTotal
                            const proptionalDiscount = itemTotal / orderTotalWithoutDiscount * totalOrderDiscount
                            amount = itemTotal - proptionalDiscount.toFixed()
                        }
                        const userWallet = await Wallet.findOneAndUpdate({ userId: order.userId }, {
                            $inc: {
                                balance: amount
                            }
                        }, { upsert: true, new: true })
                        console.log(userWallet)
                        await Transaction.create({
                            userId: order.userId,
                            walletId: userWallet._id,
                            type: 'credit',
                            amount: amount,
                            associatedOrder: order._id
                        })
                    }

                    break;
                }
            }
            const itemStatuses = order.items.map(item => item.status)
            const isAllItemsReturned = itemStatuses.every((status) => status == "Returned")
            if (isAllItemsReturned) {
                order.orderStatus = "Returned"
                order.cancellationReason = "All Items Are Returned"
            }
            await order.save()
            res.status(200).json({ success: true, isAllItemsReturned })
        } catch (err) {
            console.log(err)
            res.status(400).json({ success: false, message: "Something Went Wrong" })
        }
    },
    async rejectItemReturn(req, res) {
        try {
            const { orderId, itemId } = req.params
            const order = await Order.findOne({ _id: orderId })
            for (let i = 0; i < order.items.length; i++) {
                if (order.items[i].bookId == itemId) {
                    order.items[i].status = "Delivered"
                }
            }
            await order.save()
            res.status(200).json({ success: true })
        } catch (err) {
            console.log(err)
            res.status(400).json({ success: false, message: "Something Went Wrong" })
        }
    },
    async paymentSuccess(req, res) {
        try {
            const { orderId } = req.params
            console.log(orderId)
            await Order.updateOne({ _id: orderId }, {
                $set: {
                    paymentStatus: "Success"
                }
            })
            res.status(200).json({ success: true })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: fale, message: "Something Went Wrong" })
        }
    }
}