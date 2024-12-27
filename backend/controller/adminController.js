
const User = require("../models/Users")
const bcrypt = require('bcrypt')
const { generateToken } = require("../utils/jwt")
const jwt = require('jsonwebtoken')
const Order = require("../models/Order")
module.exports = {
  async getAllUsers(req, res) {
    try {
      let { page, limit } = req.query
      page = parseInt(page)
      limit = parseInt(limit)
      let skip = (page - 1) * limit

      const { name } = req.query
      let query = {}
      if (name) {
        query = {
          $or: [
            { username: { $regex: new RegExp(name, "i") } },
            { email: { $regex: new RegExp(name, "i") } }
          ],
        };

      }
      const users = await User.find({ ...query, role: "USER" }, {
        password: 0
      }).skip(skip).limit(limit)
      const totalUsers = await User.countDocuments({ role: "USER" })

      res.status(200).json({ success: true, users, totalUsers: totalUsers })
    } catch (err) {
      res.status(400)
      throw new Error("Somthing went Wrong while fetching user data")
    }
  },

  async checkAuth(req, res) {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findOne({ _id: decoded.id })
      if (user.isBlocked) {
        return res.status(403).json({ message: 'Blocked' });
      }
      res.status(200).json({ isLoggedIn: true, role: decoded.role, id: decoded.id });
    } catch (error) {
      console.error(error);
      res.status(403).json({ isLoggedIn: false, role: null });
    }
  },
  async adminLogin(req, res) {
    try {
      const { email, password } = req.body
      const Admin = await User.findOne({ role: "ADMIN" })
      if (!Admin) return res.status(401).json({ message: "Invalid Credential" })
      if (Admin?.email == email) {
        const isMatched = await bcrypt.compare(password, Admin.password)
        if (isMatched) {
          const token = await generateToken({ id: Admin._id, role: Admin.role })
          res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/', 
            maxAge: 24 * 60 * 60 * 1000
          })

          return res.status(200).json({ success: true, token })
        }
      }
      return res.status(401).json({ message: "Invalid Credential" })
    } catch (err) {
      return res.status(401).json({ message: "Invalid Credential" })
    }
  },
  async getSalesReport(req, res) {
    try {
      const { filterType } = req.params
      const { startDate, endDate } = req.body


      let find = {}
      switch (filterType) {
        case 'daily':
          find = { orderDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
          break;
        case 'weekly':
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          find = { orderDate: { $gte: weekAgo } }
          break;
        case 'monthly':
          const monthAgo = new Date()
          monthAgo.setDate(monthAgo.getDate() - 30)
          find = { orderDate: { $gte: monthAgo } }
          break;
        case 'yearly':
          const yearAgo = new Date()
          yearAgo.setDate(yearAgo.getDate() - 365)
          find = { orderDate: { $gte: yearAgo } }
          break;
        case 'custom':
          const start = new Date(startDate);
          const end = new Date(endDate);
          console.log(start, end, startDate, endDate)
          find = { orderDate: { $gte: start, $lte: end } }
          break;
        default:
          find
      }
      const orders = await Order.find({ ...find, orderStatus: "Delivered" }).populate("items.bookId").populate("userId")
      let totalRevenue = totalSales = itemsSold = totalDiscount = 0
      for (const order of orders) {
        totalRevenue += order.totalAmount;
        totalDiscount += order.totalDiscount || 0
        if (order.orderStatus == "Delivered") {
          totalSales += 1
          for (let item of order.items) {
            itemsSold += item.quantity
          }
        }
      }
      const salesReport = {
        filterType: filterType,
        totalRevenue,
        totalDiscount,
        totalSales,
        itemsSold,
        orders: [...orders],
        startDate,
        endDate
      }



      let salesChart = ordersChart = []

      let groupBy
      if (filterType === 'daily') {
        groupBy = {
          $dateToString: {
            format: "%H",
            date: "$orderDate",
            timezone: "Asia/Kolkata",
          }
        }
      } else if (filterType === 'weekly') {
        groupBy = { $dayOfWeek: "$orderDate" }
      } else if (filterType === 'monthly') {
        groupBy = { $dayOfMonth: "$orderDate" }
      } else if (filterType === 'yearly') {
        groupBy = { $month: "$orderDate" }
      } else if (filterType === 'custom') {
        groupBy = {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$orderDate",
            timezone: "Asia/Kolkata"
          }
        };
      }
      salesChart = await Order.aggregate([
        { $match: { ...find, orderStatus: "Delivered" } },
        {
          $group: {
            _id: groupBy,
            totalSales: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      ordersChart = await Order.aggregate([
        { $match: { ...find } },
        {
          $group: {
            _id: groupBy,
            totalOrders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      if (filterType === 'custom' && find.orderDate?.$gte && find.orderDate?.$lte) {
        const startDate = new Date(find.orderDate.$gte);
        const endDate = new Date(find.orderDate.$lte);

        const fillMissingDates = (data, valueField) => {
          const dateMap = new Map(data.map(item => [item._id, item[valueField]]));
          const filledData = [];

          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            filledData.push({
              _id: dateStr,
              [valueField]: dateMap.get(dateStr) || 0
            });
          }

          return filledData;
        };

        salesChart = fillMissingDates(salesChart, 'totalSales');
        ordersChart = fillMissingDates(ordersChart, 'totalOrders');
      }

      chartData = {
        salesChart,
        ordersChart
      }
      res.status(200).json({ success: true, salesReport, chartData: chartData })
    } catch (error) {
      res.status(400).json({ message: "Something Went Wrong" })
    }
  },
  async getOverallStates(req, res) {
    try {
      const salesCount = await Order.countDocuments({ orderStatus: "Delivered" })
      const userCount = await User.countDocuments({})
      const orders = await Order.find({})
      const orderCount = orders.length
      const totalDiscount = orders.reduce((total, order) => {
        total += order.totalDiscount || 0
        return total
      }, 0)
      res.status(200).json({ overall: { orderCount, salesCount, userCount, totalDiscount } })
    } catch (err) {
      res.status(400).json({ message: "Somthing Went Wrong" })
    }
  },
  async topSelling(req, res) {
    try {
      const [topBooks, topCategories, topAuthors] = await Promise.all([
        Order.aggregate([
          { $match: { orderStatus: "Delivered" } },
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.bookId",
              total: { $sum: "$items.quantity" }
            }
          },
          { $sort: { total: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: "books",
              localField: "_id",
              foreignField: "_id",
              as: "bookDetails"
            }
          },
          { $unwind: "$bookDetails" },
          {
            $project: {
              _id: 0,
              bookId: "$_id",
              title: "$bookDetails.title",
              author: "$bookDetails.author",
              totalSold: "$total"
            }
          }
        ]),
        Order.aggregate([
          { $match: { orderStatus: "Delivered" } },
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.bookId",
              total: { $sum: "$items.quantity" }
            }
          },
          { $sort: { total: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: "books",
              localField: "_id",
              foreignField: "_id",
              as: "bookDetails"
            }
          },
          { $unwind: "$bookDetails" },
          {
            $group: {
              _id: "$bookDetails.category",
              total: { $sum: 1 }
            }
          },
          {
            $lookup: {
              from: "categories",
              localField: "_id",
              foreignField: "_id",
              as: "categoryDetails"
            }
          },
          { $unwind: "$categoryDetails" }
        ]),
        Order.aggregate([
          { $match: { orderStatus: "Delivered" } },
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.bookId",
              total: { $sum: "$items.quantity" }
            }
          },
          { $sort: { total: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: "books",
              localField: "_id",
              foreignField: "_id",
              as: "bookDetails"
            }
          },
          { $unwind: "$bookDetails" },
          {
            $group: {
              _id: "$bookDetails.author",
              total: { $sum: 1 }
            }
          }
        ]),
      ])
      res.status(200).json({ topBooks, topCategories, topAuthors })
    } catch (err) {
      res.status(400).json({ message: "Somthing Went Wrong" })
    }
  }

}