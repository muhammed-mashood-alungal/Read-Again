// const jwt = require("jsonwebtoken");
// const User = require("../models/Users");

// const isAdmin=async(req,res,next)=>{
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token){
//         res.status(401)
//         throw new Error("Access Denied")
//     }
//     try{
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         if(decoded.role == "ADMIN"){
//             next()
//         }else{
//             res.status(401)
//             res.status(401).json({message:"UnAuthorized"})
//         }
//     }catch(err){
//         if (err) {
//             res.status(401).json({message:"UnAuthorized"})
//         } 
       
//     }
    
    
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
