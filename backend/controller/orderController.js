const Address = require("../models/Address");
const Book = require("../models/Books");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/Users");
const Coupon = require("../models/Coupon");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/WalletTransactions");
const { getAddressString } = require("../services/userServices");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

module.exports = {
  async placeOrder(req, res) {
    try {
      const { userId } = req.params;
      const orderDetails = req.body;
      if (
        orderDetails.paymentMethod == "COD" &&
        orderDetails.payableAmount > 1000
      ) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({
            message: "Cash On delivery Not Available for Order above Rs 1000",
          });
      }
      const address = await Address.findOne({ userId, isDefault: true });
      if (!address) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Address Not Found" });
      }
      const shippingAddress = getAddressString(address);
      const user = await User.findOne({ _id: userId });

      if (orderDetails.coupon) {
        const couponData = await Coupon.findOne({ code: orderDetails.coupon });
        orderDetails.totalDiscount =
          orderDetails.totalAmount - orderDetails.payableAmount;
        if (
          !couponData ||
          !couponData.isActive ||
          couponData.currentUsage >= couponData.maxUsage
        ) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({
              success: false,
              message: `The ${orderDetails.coupon} Coupon No Longer Available.`,
            });
        } else {
          if (user.usedCoupons.includes(couponData._id)) {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({
                success: false,
                message: `The ${orderDetails.coupon} coupon is Already Once Used.`,
              });
          }
          user.usedCoupons = [...user.usedCoupons, couponData._id];
          couponData.currentUsage += 1;
          await user.save();
          await couponData.save();
          orderDetails.coupon = couponData._id;
        }
      } else {
        delete orderDetails.coupon;
      }

      const response = await Order.create({
        userId,
        ...orderDetails,
        shippingAddress,
      });
      const cart = await Cart.findOne({ userId });
      if (orderDetails.paymentMethod == "Wallet") {
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ success: false, message: "No Wallet For this User" });
        }
        if (wallet.balance < orderDetails.payableAmount) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({
              success: false,
              message: "Wallet Haven't Sufficient balance",
            });
        }
        await Transaction.create({
          userId,
          walletId: wallet._id,
          type: "debit",
          amount: orderDetails.payableAmount,
          associatedOrder: response._id,
        });
        wallet.balance -= orderDetails.payableAmount;

        response.paymentStatus = "Success";
        await response.save();
        await wallet.save();
      }

      for (let i = 0; i < orderDetails.items.length; i++) {
        const book = await Book.findOne({
          _id: orderDetails.items[i].bookId,
          isDeleted: false,
        });

        if (!book) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({
              success: false,
              message: `Some Books are No Longer Available.`,
            });
        }
        if (
          cart &&
          book.formats.physical.stock < orderDetails.items[i].quantity
        ) {
          cart.items[i].quantity = book.formats.physical.stock;
          cart.totalQuantity =
            cart.totalQuantity -
            (orderDetails.items[i].quantity - book.formats.physical.stock);
          cart.save();
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({
              success: false,
              message: `${book.title} Have not much Stock`,
            });
        }
        book.formats.physical.stock =
          book?.formats?.physical?.stock - orderDetails.items[i].quantity;
        if (book.appliedOffer && book.appliedOffer?.isActive) {
          response.totalDiscount +=
            book.formats.physical.price - orderDetails.items[i].unitPrice;
          response.save();
        }
        if (book.formats.physical.stock == 0) {
          book.stockStatus = "Out Of Stock";
        } else if (book.formats.physical.stock < 10) {
          book.stockStatus = "Hurry Up";
        } else {
          book.stockStatus = "In Stock";
        }
        book.save();
      }

      if (cart) {
        await cart.deleteOne();
      }
      res
        .status(StatusCodes.OK)
        .json({
          success: true,
          orderId: response._id,
          user,
          orderDetails: response,
        });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
    }
  },
  async changeStatus(req, res) {
    try {
      const { orderId, status } = req.params;
      const order = await Order.findOneAndUpdate(
        { _id: orderId },
        {
          $set: {
            orderStatus: status,
          },
        }
      );

      order.items = order.items.map((item) => {
        if (item.status != "Canceled") {
          item.status = status;
        }
        return item;
      });
      if (status == "Delivered") {
        order.paymentStatus = "Success";
        order.deliveryDate = Date().now;
      }
      order.save();
      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Something went wrong while changing order status" });
    }
  },
  async getUserOrders(req, res) {
    try {
      let { page, limit } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      let skip = (page - 1) * limit;

      const { userId } = req.params;
      const orders = await Order.find({ userId })
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate("items.bookId")
        .populate("userId")
        .populate("coupon");

      const totalOrders = await Order.countDocuments({ userId });
      res.status(StatusCodes.OK).json({ success: true, orders, totalOrders });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false });
    }
  },
  async getAllOrders(req, res) {
    try {
      let { page, limit, orderStatus, paymentStatus } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      let skip = (page - 1) * limit;

      let find = {};
      if (orderStatus == "ordered") {
        find = { orderStatus: "Ordered" };
      } else if (orderStatus == "shipped") {
        find = { orderStatus: "Shipped" };
      } else if (orderStatus == "delivered") {
        find = { orderStatus: "Delivered" };
      } else if (orderStatus == "canceled") {
        find = { orderStatus: "Canceled" };
      } else if (orderStatus == "returned") {
        find = { orderStatus: "Returned" };
      } else if (orderStatus == "return requested") {
        find = { orderStatus: "Return Requested" };
      } else if (orderStatus == "return rejected") {
        find = { orderStatus: "Return Rejected" };
      }

      if (paymentStatus == "success") {
        find = { ...find, paymentStatus: "Success" };
      } else if (paymentStatus == "pending") {
        find = { ...find, paymentStatus: "Pending" };
      } else if (paymentStatus == "refunded") {
        find = { ...find, paymentStatus: "Refunded" };
      }

      const orders = await Order.find(find)
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate("items.bookId")
        .populate("userId")
        .populate("coupon");
      const totalOrders = await Order.countDocuments(find);
      res.status(StatusCodes.OK).json({ success: true, orders, totalOrders });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false });
    }
  },
  async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      const { cancellationReason } = req.body;
      const order = await Order.findOne({ _id: orderId });
      order.orderStatus = "Canceled";
      order.cancelReason = cancellationReason;
      for (const item of order.items) {
        item.status = "Canceled";
        item.reason = cancellationReason;
        const book = await Book.findOne({ _id: item.bookId });
        if (book) {
          book.formats.physical.stock += item.quantity;
          if (book.formats.physical.stock <= 0) {
            book.stockStatus = "Out Of Stock";
          } else if (book.formats.physical.stock <= 10) {
            book.stockStatus = "Hurry Up";
          } else {
            book.stockStatus = "In Stock";
          }
          await book.save();
        }
      }

      if (order.paymentStatus == "Success") {
        const amount = order.payableAmount;
        const userWallet = await Wallet.findOneAndUpdate(
          { userId: order.userId },
          {
            $inc: {
              balance: amount,
            },
          },
          { upsert: true, new: true }
        );
        await Transaction.create({
          userId: order.userId,
          walletId: userWallet._id,
          type: "credit",
          amount: amount,
          associatedOrder: order._id,
        });
        order.paymentStatus = "Refunded";
      }
      order.payableAmount = 0;
      await order.save();
      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async requestReturnOrder(req, res) {
    try {
      const { orderId } = req.params;
      const { returnReason } = req.body;
      const order = await Order.findOne({ _id: orderId });
      order.orderStatus = "Return Requested";
      order.returnReason = returnReason;
      for (const item of order.items) {
        item.status = "Return Requested";
        const book = await Book.findOne({ _id: item.bookId });
        if (book) {
          await book.save();
        }
      }
      await order.save();
      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async approveReturnRequest(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findOneAndUpdate(
        { _id: orderId },
        {
          $set: {
            orderStatus: "Returned",
          },
        },
        { new: true }
      );

      for (const item of order.items) {
        item.status = "Returned";
      }

      if (order.paymentStatus == "Success") {
        const amount = order.totalAmount;
        const userWallet = await Wallet.findOneAndUpdate(
          { userId: order.userId },
          {
            $inc: {
              balance: amount,
            },
          },
          { upsert: true, new: true }
        );
        await Transaction.create({
          userId: order.userId,
          walletId: userWallet._id,
          type: "credit",
          amount: amount,
          associatedOrder: order._id,
        });
      }
      order.paymentStatus = "Refunded";
      res.status(StatusCodes.OK).json({ success: true });
    } catch {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR});
    }
  },
  async rejectReturnRequest(req, res) {
    try {
      const { orderId } = req.params;
      await Order.findOneAndUpdate(
        { _id: orderId },
        {
          $set: {
            isRejectedOnce: true,
            orderStatus: "Delivered",
            paymentStatus: "Success",
          },
        }
      );
      res.status(StatusCodes.OK).json({ success: true });
    } catch {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async cancelOrderItem(req, res) {
    try {
      const { orderId, itemId } = req.params;
      const { cancellationReason } = req.body;
      const order = await Order.findOne({ _id: orderId });
      const coupon = order.coupon;
      const couponData = await Coupon.findOne({ _id: coupon });
      let itemTotal = (amount = 0);
      for (let i = 0; i < order.items.length; i++) {
        if (order.items[i].bookId == itemId) {
          order.items[i].status = "Canceled";
          order.items[i].reason = cancellationReason;
          const book = await Book.findOne({ _id: itemId });
          book.formats.physical.stock += order.items[i].quantity;
          await book.save();
          itemTotal = order.items[i].totalPrice;
          if (order.paymentStatus == "Success") {
            const orderTotal = order.totalAmount;

            amount = itemTotal;
            if (coupon) {
              const percentage = couponData.discountValue;
              let orderTotalWithoutDiscount =
                orderTotal / (1 - percentage / 100);
              orderTotalWithoutDiscount = orderTotalWithoutDiscount.toFixed();
              var totalOrderDiscount = orderTotalWithoutDiscount - orderTotal;
              var proptionalDiscount =
                (itemTotal / orderTotalWithoutDiscount) * totalOrderDiscount;
              amount = itemTotal - proptionalDiscount.toFixed();
            }
            const userWallet = await Wallet.findOneAndUpdate(
              { userId: order.userId },
              {
                $inc: {
                  balance: amount,
                },
              },
              { upsert: true, new: true }
            );
            await Transaction.create({
              userId: order.userId,
              walletId: userWallet._id,
              type: "credit",
              amount: amount,
              associatedOrder: order._id,
            });
          }
          order.payableAmount = order.payableAmount - order.items[i].totalPrice;

          if (coupon && order.payableAmount < couponData?.minimumPrice) {
            let newPayableAmount = 0;
            for (let item of order.items) {
              if (item.status !== "Canceled") {
                newPayableAmount += item.totalPrice;
              }
            }
            order.payableAmount = newPayableAmount;
            order.coupon = null;
          }
          break;
        }
      }

      const itemStatuses = order.items.map((item) => item.status);
      const isAllItemsCancelled = itemStatuses.every(
        (status) => status == "Canceled"
      );
      if (isAllItemsCancelled) {
        order.orderStatus = "Canceled";
        order.cancellationReason = "All Items Are Cancelled";
      }
      await order.save();

      res
        .status(StatusCodes.OK)
        .json({
          success: true,
          isAllItemsCancelled,
          newPayableAmount: order.payableAmount,
        });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
    }
  },
  async returnOrderItem(req, res) {
    try {
      const { orderId, itemId } = req.params;
      const { returnReason } = req.body;
      const order = await Order.findOne({ _id: orderId });
      for (let i = 0; i < order.items.length; i++) {
        if (order.items[i].bookId == itemId) {
          order.items[i].status = "Return Requested";
          order.items[i].reason = returnReason;
        }
      }
      await order.save();
      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message:ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
    }
  },
  async approveItemReturn(req, res) {
    try {
      const { orderId, itemId } = req.params;
      const order = await Order.findOne({ _id: orderId });
      for (let i = 0; i < order.items.length; i++) {
        if (order.items[i].bookId == itemId) {
          order.items[i].status = "Returned";
          const book = await Book.findOne({ _id: itemId });
          book.formats.physical.stock += order.items[i].quantity;
          await book.save();

          if (order.paymentStatus == "Success") {
            const orderTotal = order.totalAmount;
            const itemTotal = order.items[i].totalPrice;
            const coupon = order.coupon;
            let amount = itemTotal;
            if (coupon) {
              const couponData = await Coupon.findOne({ _id: coupon });
              const percentage = couponData.discountValue;
              let orderTotalWithoutDiscount =
                orderTotal / (1 - percentage / 100);
              orderTotalWithoutDiscount = orderTotalWithoutDiscount.toFixed();
              const totalOrderDiscount = orderTotalWithoutDiscount - orderTotal;
              const proptionalDiscount =
                (itemTotal / orderTotalWithoutDiscount) * totalOrderDiscount;
              amount = itemTotal - proptionalDiscount.toFixed();
            }
            const userWallet = await Wallet.findOneAndUpdate(
              { userId: order.userId },
              {
                $inc: {
                  balance: amount,
                },
              },
              { upsert: true, new: true }
            );
            await Transaction.create({
              userId: order.userId,
              walletId: userWallet._id,
              type: "credit",
              amount: amount,
              associatedOrder: order._id,
            });
          }

          break;
        }
      }
      const itemStatuses = order.items.map((item) => item.status);
      const isAllItemsReturned = itemStatuses.every(
        (status) => status == "Returned"
      );
      if (isAllItemsReturned) {
        order.orderStatus = "Returned";
        order.cancellationReason = "All Items Are Returned";
      }
      await order.save();
      res.status(StatusCodes.OK).json({ success: true, isAllItemsReturned });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async rejectItemReturn(req, res) {
    try {
      const { orderId, itemId } = req.params;
      const order = await Order.findOne({ _id: orderId });
      for (let i = 0; i < order.items.length; i++) {
        if (order.items[i].bookId == itemId) {
          order.items[i].status = "Delivered";
        }
      }
      await order.save();
      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async paymentSuccess(req, res) {
    try {
      const { orderId } = req.params;
      await Order.updateOne(
        { _id: orderId },
        {
          $set: {
            paymentStatus: "Success",
          },
        }
      );
      res.status(StatusCodes.OK).json({ success: true });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: fale, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async getOrderData(req, res) {
    try {
      const { orderId } = req.params;
      const orderData = await Order.findById(orderId)
        .populate("userId")
        .populate("items.bookId");
      res.status(StatusCodes.OK).json({ success: true, orderData: orderData });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: err?.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
    }
  },
};
