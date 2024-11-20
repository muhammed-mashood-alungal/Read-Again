const Category = require("../models/Category")
const User = require("../models/Users")
<<<<<<< HEAD
const bcrypt =  require('bcrypt')
const { generateToken } = require("../utils/jwt")
module.exports={
    async getAllUsers(req,res){
        try{
            let {page , limit} = req.query
            page = parseInt(page)
            limit = parseInt(limit)
            let skip = (page-1)*limit
           const users = await User.find({},{
            password:0
           }).skip(skip).limit(limit)
            const totalUsers = await User.countDocuments({role:"USER"})
                console.log(totalUsers)
            
           res.status(200).json({success:true , users , totalUsers:totalUsers})
        }catch(err){
         console.log(err) 
         res.status(400)
         throw new Error("Somthing went Wrong while fetching user data")
        }
    },
    async addCategory(req,res){
      try{
         const data ={
            name: req.body.name,
            image:req.file.filename
         }
         const response = await Category.create(data)
=======
const bcrypt = require('bcrypt')
const { generateToken } = require("../utils/jwt")
const jwt = require('jsonwebtoken')
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
>>>>>>> dc5bdfea52910490befd6242471e3f6164bc8958

      }
<<<<<<< HEAD
    },
    async getAllCategories(req,res){
        try{
           const categories =await Category.find({})
           res.status(200).json({categories:categories})
        }catch(err){
          res.status(400).json({messsage:err})
        }
    },
    async getCategoryData(req,res){
      try{
        console.log(req.params.categortId)
        const categoryData =await Category.findOne({_id:req.params.categoryId})
        console.log(categoryData)
        res.status(200).json({categoryData:categoryData})
     }catch(err){
       res.status(400).json({messsage:err})
     }
    },
    async updateCategory(req,res){ 
      try {
        console.log("helasdfasdfksdf")
        const {categoryId}=req.params
        let updatedData={...req.body}
        console.log(categoryId, updatedData)
        if (req.file) {
          updatedData.image = req.file.filename
        }
    
        const updatedCategory = await Category.findByIdAndUpdate(
          categoryId,
          { $set: updatedData },
          { new: true }
        );

        res.status(200).json({ success: true, updatedCategory });
      } catch (err) {
        res.status(400).json({ success: false, message: "Error while updating category" })
      }
    }, 
    async adminLogin(req,res){
      try{
       const {email,password} = req.body
       console.log(email,password)
       const Admin = await User.findOne({role:"ADMIN"})
       if(!Admin)  return res.status(401).json({message:"Invalid Credential"})
       if(Admin?.email == email){
        const isMatched = await bcrypt.compare(password,Admin.password)
         if(isMatched){
             const token = await generateToken({id:Admin._id, role : Admin.role})
            return  res.status(200).json({success:true , token})
         }
       }
        return res.status(401).json({message:"Invalid Credential"})
      }catch(err){
        console.log(err)
        return res.status(401).json({message:"Invalid Credential"})
      }
=======
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
>>>>>>> dc5bdfea52910490befd6242471e3f6164bc8958
    }
  },
   checkAuth(req, res) {
    console.log("check-auth")
    const token = req.cookies.token
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        res.status(200).json({ isLoggedIn : true , role: decoded.role  });
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
  }

}