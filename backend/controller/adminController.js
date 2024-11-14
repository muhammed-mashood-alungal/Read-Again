const Category = require("../models/Category")
const User = require("../models/Users")
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
        console.log(req.body,req.file)
         const data ={
            name: req.body.name,
            image:req.file?.filename
         }
         const response = await Category.create(data)

         res.status(200).json({success:true})

      }catch(err){
        console.log(err)
      
        res.status(400).json({ success: false, message: "Error while Creating category" });
      }
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
    }
    
}