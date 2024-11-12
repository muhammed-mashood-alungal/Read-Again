const User = require("../models/Users")

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
         const {name} = req.body

      }catch(err){

      }
    }
}