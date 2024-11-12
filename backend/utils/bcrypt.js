const bcrypt = require('bcrypt')

const hashPassword =async (pass) =>{
   try{
    console.log(pass)
    const saltRound = 10 
    const hashed = await bcrypt.hash(pass , saltRound)
    return hashed
   }catch(err){
    console.log(err)
    throw new Error("Error while hashing Password")
   }
}

module.exports ={hashPassword}