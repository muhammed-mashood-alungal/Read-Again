import { axiosUserInstance } from "../redux/Constants/axiosConstants";

export async function validateUpdateProfile(formData,currentEmail){
   const {username, email  } = formData
   const usernameReg = /^[A-Za-z\s]*$/;
   const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   const numberReg = /^\d{10}$/;
   if(username.trim() == ""){
     return {success:false , message : "Please Enter an Username"}
   }
   if(!usernameReg.test(username) ){
    return {success:false , message : "No Numbers or Special Charecters Allowed"}
   }
   
 
   if(currentEmail != email){
    if(email.trim() == ""){
      return {success:false , message : "Please Enter an Email"}
     }
     if(!emailReg.test(email)){
      return {success:false , message : "Please Enter an Valid Email Address"}
     }
     try{
      const response=await axiosUserInstance.get(`/${email}/exist`)
      console.log(response)
      if(response?.data?.user?.email){
        return {success:false , message : "This Email already Exists"}
      }
        return {success:true}
     }catch(err){
      console.log(err.response.status)
      if(err.response.status == 409 ){
        return {success:false , message : "This Email already Exists"}
       }
       if(err.response.status == 500){
        return {success:false , message : "Somthing Went Wrong , Please Try later"}
       }
    }
   }
   return {success:true}
   
  
}

export function validateChangePass(currentPass,newPass,confirmPass){
   const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
   if(currentPass.trim() == ""){
    return {success:false , message:"Please Enter a password"}
   }
   if(newPass.trim() == ""){
    return {success: false , message : " Please Enter a New Password"}
   }
   if(confirmPass.trim() == ""){
    return {success : false , message: "Please Enter a confirm Password"}
   }
   if(!passwordReg.test(newPass)){
    return {success:false , message : "Password Should Contains , at least one lowercase letter,uppercase letter,digit and special character"}
   }
   if(newPass != confirmPass){
    return {success :false , message : "Confirm Password Doesn't match"}
   }
   return {success : true}
}

export function validateAddress(formData){
  const {city,phoneNumbers,country,landmark,state,postalCode,district}=formData
  const numberReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  let addressError = {phoneNumbers:[]}
  let hasError = false
  if(city.trim()== ''){
      addressError.city="Please Enter a City"
      hasError=true
  }
  if(landmark.trim()== ""){
      addressError.landmark = "Please Enter a Landmark"
      hasError=true
  }
  if(district.trim()== ""){
      addressError.district = "Please Enter a district"
      hasError=true
  }
  if(state.trim()== ""){
      addressError.state = "Please Enter a state"
      hasError=true
  }
  if(country.trim()== ""){
     addressError.country= "Please Enter a Country"
     hasError=true
  }
  if(postalCode.trim()== ""){
     addressError.postalCode = "Please Enter a valid Post Code"
     hasError=true
  }
  if(!numberReg.test(phoneNumbers[0])){
      addressError.phoneNumbers[0]="Phone Number Should be valid"
      hasError=true
  }
  if(phoneNumbers[1] && !numberReg.test(phoneNumbers[1])){
     addressError.phoneNumbers[1]="Scondary Phone Number Should be valid"
     hasError=true
  }
  return {hasError  , addressError:addressError}
}