const jwt = require('jsonwebtoken')
// const User = require("../models/Users");
//import jwt from 'jsonwebtoken'
module.exports =  {
    async isAdmin(req,res,next){
    try{
    console.log(req.cookies)
    const token = req.cookies.token
    console.log("token ",token)
    if (!token){
        console.log("token")
      return  res.status(401).json({message:"Access Denied"})
    }
   
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("decoded")
        console.log(decoded.role)
        if(decoded.role == "ADMIN"){
            next()
        }else{
            res.status(401).json({message:"UnAuthorized dsfas"})
        } 
    }catch(err){
        console.log(err)
        if (err) {
            res.status(401).json({message:"UnAuthorized"})
        } 
    }
}
}
    
    
// }
// const protect=async(req,res,next)=>{
//     try{
//         const authHeader = req.headers['authorization'];
//         const token = authHeader && authHeader.split(' ')[1];
    
//         if (!token){
//            res.status(401).json({message:"UnAuthorized"})
           
//         } 
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         req.user=await User.findOne({_id:decoded.id})
//         console.log(req.user)
//         next()
//     }catch(err){
//         if (err) {
//             res.status(403).json({message:"Forbidden"})
//         } 
       
//     }
// }
// const isLoggedIn=async(req,res,next)=>{
//     try{
//         console.log("helloooasdfs")
//         const authHeader = req.headers['authorization'];
//         const token = authHeader && authHeader.split(' ')[1];
//         console.log(token)
//         if (!token){
//          return   res.status(401).json({message:"UnAuthorized"})
//         } 
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         const user=await User.findOne({_id:decoded.id})
//         res.status(200).json({success:true,user:user})
//     }catch(err){
//         console.log(err)
//         if (err) {
//             res.status(500).json({success:false,message:'authentication Failed'})
//         } 
       
//     }
// }

// module.exports={isAdmin,protect,isLoggedIn}
