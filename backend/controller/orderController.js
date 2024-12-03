const Address = require("../models/Address")
const Book = require("../models/Books")
const Cart = require("../models/Cart")
const Order = require("../models/Order")

module.exports = {
    async placeOrder(req, res) {
        try {
            const { userId } = req.params
            const orderDetails = req.body
            const { city, landmark, district, state, country, postalCode, phoneNumbers } = await Address.findOne({ userId, isDefault: true })
            const shippingAddress = `${city},Near ${landmark},${district},${state},${country},${postalCode},${phoneNumbers[0]} & ${phoneNumbers[1] && phoneNumbers[1]}`
            console.log(userId, shippingAddress, orderDetails)
            await Order.create({ userId, ...orderDetails, shippingAddress })
            for (let i = 0; i < orderDetails.items.length; i++) {
                const book = await Book.findOne({ _id: orderDetails.items[i].bookId, isDeleted: false })
                console.log(book)
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

            res.status(200).json({ success: true })
        } catch (err) {
            console.log(err)
            res.status(400).json({ success: false, message: "Order Placing Failed Please try Again" })
        }
    },
    async updateOrderStatus(req, res) {
        try {

            const { orderId } = req.params
            const { status, reason } = req.body
            const order = await Order.findOneAndUpdate({ _id: orderId }, {
                $set: {
                    orderStatus: status
                }
            })
            if (status == "ordered" || status == "canceled" || status == "returned") {
                order.items = order.items.map((item) => {
                    item.status = status
                    return item
                })
                if (status == 'canceled') {
                    order.cancelReason = reason
                }
                if (status == 'returned') {
                    order.cancelReason = reason
                }
                order.save()
            }

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
            const orders = await Order.find({ userId }).populate("items.bookId")
            console.log(orders)
            res.status(200).json({ success: true, orders })
        } catch (err) {
            console.log(err)
            res.status(400).json({ success: false })
        }
    },
    async getAllOrders(req, res) {
        try {
            const orders = await Order.find({}).populate("items.bookId")
            res.status(200).json({ success: true, orders })
        } catch (err) {
            console.log(err)
            res.status(400).json({ success: false })
        }
    },
    async cancelOrder(req, res) {
        try {
            
            const { orderId } = req.params
            const {cancellationReason} = req.body
            console.log(cancellationReason)
            const order = await Order.findOne({ _id: orderId })
            order.orderStatus = "Canceled"
            order.cancelReason = cancellationReason
            for (const item of order.items) {
                item.status = "Canceled";
                const book = await Book.findOne({ _id: item.bookId });
                if (book) {
                    book.formats.physical.stock += 1;
                    await book.save();
                }
            }
            await order.save()
            res.status(200).json({success:true})
        } catch (err) {
            console.log(err)
            res.status(400).json({message:"Something Went Wrong"})
        }
    },
    async requestReturnOrder(req,res){
        try{
            const {orderId} = req.params
            const {returnReason}=req.body
            console.log(returnReason)
            const order = await Order.findOne({_id:orderId})
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
            res.status(200).json({success:true})
        }catch(err){
            console.log(err)
            res.status(400).json({message:"Something Went Wrong"})
        }
    } 
}