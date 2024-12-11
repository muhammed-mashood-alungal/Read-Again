const Category = require("../models/Category")
const User = require("../models/Users")
const bcrypt = require('bcrypt')
const { generateToken } = require("../utils/jwt")
const jwt = require('jsonwebtoken')
const Order = require("../models/Order")
const Coupon = require("../models/Coupon")
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
      console.log(users)
      const totalUsers = await User.countDocuments({ role: "USER" })

      res.status(200).json({ success: true, users, totalUsers: totalUsers })
    } catch (err) {
      console.log(err)
      res.status(400)
      throw new Error("Somthing went Wrong while fetching user data")
    }
  },
   async checkAuth(req, res) {
    console.log("check-auth")
    const token = req.cookies.token
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({_id:decoded.id})
        if(user.isBlocked){
          return res.status(403).json({ message: 'Blocked' });
        }
        res.status(200).json({ isLoggedIn : true , role: decoded.role ,id:decoded.id });
    } catch (error) {
        console.error(error);
        res.status(403).json({ isLoggedIn : false , role: null});
    }
  },
  async adminLogin(req, res) {
    try {
      const { email, password } = req.body
      console.log(email, password)
      const Admin = await User.findOne({ role: "ADMIN" })
      if (!Admin) return res.status(401).json({ message: "Invalid Credential" })
      if (Admin?.email == email) {
        const isMatched = await bcrypt.compare(password, Admin.password)
        if (isMatched) {
          const token = await generateToken({ id: Admin._id, role: Admin.role })
            res.cookie('token',token,{
              httpOnly:true,
              secure:true
            })
            
          return res.status(200).json({ success: true, token })
        }
      }
      return res.status(401).json({ message: "Invalid Credential" })
    } catch (err) {
      console.log(err)
      return res.status(401).json({ message: "Invalid Credential" })
    }
  },
  async getSalesReport(req,res){
      try {
        const {filterType} = req.params
        const {startDate,endDate} = req.body

        
        let find = {}
        switch(filterType){
          case 'daily':
            find = { orderDate: { $gte: new Date().setHours(0, 0, 0, 0) } }
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
          case 'custom':
            const start = new Date(startDate); 
            const end = new Date(endDate);
            console.log(start,end,startDate,endDate)
            find = {orderDate : {$gte : start , $lte : end}}
            break;
          default:
            find
        }
        const orders = await Order.find({...find,orderStatus:"Delivered"}).populate("items.bookId").populate("userId")
        //salesReport.orders = orders
        let totalRevenue = 0
        let totalCouponDiscount = 0
        let totalSales = 0
        let itemsSold = 0
        
        for (const order of orders) {
            totalRevenue += order.totalAmount;
            if(order.orderStatus == "Delivered"){
              totalSales += 1
              for(let item of order.items){
                itemsSold += item.quantity
              }
            }
            if (order.coupon) {
                const coupon = await Coupon.findOne({ _id: order.coupon });
                const percentage = coupon.discountValue;
                const orderTotalWithoutDiscount = order.totalAmount / (1 - percentage / 100);
                totalCouponDiscount += orderTotalWithoutDiscount.toFixed() - order.totalAmount;
            }
        }
         const salesReport = {
          filterType :filterType ,
          totalRevenue,        
          totalCouponDiscount,
          totalSales,
          itemsSold,
          orders:[...orders],
          startDate,
          endDate
        }
        console.log(totalRevenue,totalCouponDiscount,totalSales,itemsSold)
        res.status(200).json({success:true, salesReport})
      } catch (error) { 
        console.log(error)
        res.status(400).json()
      }
  }

}