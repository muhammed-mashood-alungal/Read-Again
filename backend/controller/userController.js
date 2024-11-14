
const { ChevronsRightLeft } = require("lucide-react");
const Otp = require("../models/Otps");
const User = require("../models/Users");
const { hashPassword, verifyPassword } = require("../utils/bcrypt");
const { generateToken, verifyToken } = require("../utils/jwt");
const  transporter = require("../utils/nodemailer");
const bcrypt = require('bcrypt');
const Category = require("../models/Category");
module.exports={
    async sendOTP(req,res){
        try{
            const {email} = req.params
            await Otp.deleteOne({email:email})
            const digits = '0123456789';
            const otpLength = 6;
            let otp = '';
        
            for(let i=1; i<=otpLength; i++){
                let index = Math.floor(Math.random()*(digits.length));
                otp = otp + digits[index];
            }
            const data ={
                otp:otp,
                email:email
            }
            console.log(data)
            const result = await Otp.create(data)
            await transporter.sendMail({
                from: 'muhdmashoodalungal@gmail.com', 
                to: email, 
                subject: "OTP for Read Again ✔",
                html: `Hello your OTP for <b>Read Again</b> bookstore is <b>${otp}</b>.This will expires after 1 minute`
              });
              
            res.status(200).json({success:true})
        }catch(err){
            console.log(err)
            res.status(400).json({success:false,message:"Something Went Wrong while creting OTP"})
        }
    
    },
    async verifyOTP(req,res){
       try{
         
           const {otp} = req.body
           const {email} = req.params
           const doc =await Otp.findOne({email:email})
           console.log(doc)
           if(!doc){
            return res.status(400).json({success:false,message:"OTP verification failed"})
           }
           console.log(doc.otp ,otp)
           if(doc.otp == otp){
            return res.status(200).json({success:true})
           }else{
            return res.status(400).json({success:false,message:"OTP verification failed"})
           }
       }catch(err){
          res.status(400).json({success:false,message:"OTP verification failed"})
       }
    },
    async createUser(req,res){
       try{
        console.log("helloooi")
        const {email} =req.body.userData
        const password = await hashPassword(req.body.userData.password)
        const user = await User.findOne({email})
        let userData={}
        let response
        if(user){
          userData={
            ...user.toObject(), 
            password:password
        }
         response =  await User.updateOne({email},{$set:userData},{upsert:true})
        }else{
           userData={
            ...req.body.userData,
            role:"USER", 
            password:password
        }
         response =  await User.create(userData)
        }
        
        if(response){
           delete userData.password
           const token = await generateToken({id:response._id,role:userData.role})
           return res.status(200).json({success:true ,userData, token })
        }else{
            return res.status(400).json({success:false , message :"something went wrong"})
        }
       }catch(err){
        console.log(err)
        return res.status(400).json({success:false , message : err? err :"Somthing went Wrong"})
       }
    },
    //To check email already exist before register
    async  isEmailExist(req,res){
      try{
        const {email} = req.params
        console.log(email)
        const user =await User.findOne({email})
        if(user && user?.password ){
         console.log(user)
           return res.status(409).json({exist: true})
        }else{
         console.log("no user")
           return res.status(200).json({exist: false})
        }
      }catch(err){
         res.status(500).json({exist:false , message:err})
      }
    
    },

    async verifyEmailExist(req,res){
      const {email} = req.params
     console.log(email)
     const user =await User.findOne({email})
     
     if(user){
        return res.status(409).json({exist: true})
     }else{
        return res.status(200).json({exist: false})
     }
    },
    async login(req,res){
      try{
       const {email, password} = req.body.userData
       const doc = await User.findOne({email})
       console.log(doc)
       if(doc.isBlocked){
        return res.status(401).json({success :false  ,message : "You are temporarily Banned "})
       }
       if(doc){
        const isMatched = await bcrypt.compare(password,doc.password)
       console.log(isMatched)
        if(isMatched){
            const {password , ...userInfo} = doc
            const token = await generateToken({id:userInfo._id, role : userInfo.role})
           return  res.status(200).json({success:true , userInfo , token})
        }
       }
        return res.status(401).json({success :false  ,message : "Invalid Creditial"})
      }catch(err){
        console.log(err)
        return res.status(401).json({success :false  ,message : "Invalid Creditial"})
      }
    },
    async setNewPassword(req,res){
        try{
          const { email } = req.params
          const { password } = req.body
          console.log(email,password)
          const hashed = await hashPassword(password)
          await User.updateOne({email},{
            $set:{
              password:hashed
            }
          })
             res.status(200).json({success:true })
        }catch(err){
            console.log(err)
            res.status(400).json({success:false ,message :"Something Went Wrong !" })
        }
    },
    async findOrCreateGoogleUser(profile){
      try {
          let user = await User.findOne({ googleId: profile.id });
          
          if (!user) {
            let emailExist = await User.findOne({email : profile.emails[0].value})
             if(!emailExist){
              user = new User({
                googleId: profile.id,
                email: profile.emails[0].value,
                username: profile.displayName,
                role:"USER"
             });
             await user.save();
            }else{
             await User.updateOne({email:profile.emails[0].value},{$set:{googleId:profile.id}})
            }
             
              
          }
  
          return user;
      } catch (error) {
          throw new Error("Error finding or creating user: " + error.message);
      }
    },
    async getUserData(req,res){
      try{
        if(req.user){
          res.status(200).json({success:true, userData : req.user})
        }
         const {userId} = req.params 
         const data = await User.findOne({_id:userId},{password:0})
         console.log(data)
         res.status(200).json({success:true, userData : data})
      }catch(err){ 
         res.status(400).json({success:false , error : err.message ? err.message : "Something went Wrong"})
      }
    },
    async blockUser(req,res){
      try{
        const {userId} = req.params
        console.log(userId)
        await User.updateOne({_id:userId},{
          $set:{
            isBlocked:true
          }
        })
        res.status(200).json({success: true })
      }catch(err){
        res.status(400)
        throw new Error("Something Went Wrong While Blocking")
      }
    },
    async unBlockUser(req,res){
      try{
        const {userId} = req.params
        console.log(userId)
        await User.updateOne({_id:userId},{
          $set:{
            isBlocked:false
          }
        })
        res.status(200).json({success: true })
      }catch(err){
        res.status(500)
        throw new Error("Something Went Wrong While Blocking")
      }
    },
    async listOrUnlistCategory(req,res){
      try{
        console.log("lsitng")
       const {categoryId} = req.params
       const category = await Category.findOne({_id:categoryId})
       if(!category){
         return res.status(404).json({message:"No such Category Found"})
       }
       console.log(category.listed)
       category.listed = !category.listed
       await category.save()
       res.status(200).json({success:true}) 
      }catch(err){
        res.status(500).json({message:"Someething Went Wrong"})
      }
    },
    async verifyToken(){
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
    
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
    
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'Token is invalid' });
        }
    
        // If the token is valid, respond with a success status
        res.status(200).json({ message: 'Token is valid' });
      });
    }
}