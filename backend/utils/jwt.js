const jwt = require('jsonwebtoken')

const generateToken=async(userInfo)=>{
    try{
        const token = await jwt.sign(userInfo , process.env.JWT_SECRET_KEY , {
            expiresIn : '1d'
        })
        return token
    }catch(err){
        console.log(err)
        throw new Error("Somthing Went Wrong While Creating Token")
    }
      
}

const verifyToken=async(token)=>{
    try{
       const verified = await jwt.verify(token , process.env.JWT_SECRET_KEY)
       if(verified){
        return {success : true }
       }else{
         return {success : false}
       }
    }catch(err){
        console.log(err)
        
        throw new Error("Something Went Wrong While verifying Token")
        
    }
    
}
module.exports={generateToken,verifyToken}