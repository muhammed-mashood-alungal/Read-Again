import { axiosUserInstance } from "../../../redux/Constants/axiosConstants";

 async function validateRegister(formData){
   const {username, email ,password , confirmPassword} = formData
   const usernameReg =/^[A-Za-z]*$/
   const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

   if(username.trim() == ""){
     return {success:false , message : "Please Enter an Username"}
   }
   if(!usernameReg.test(username) ){
    return {success:false , message : "No Numbers or Special Charecters Allowed"}
   }
   if(email.trim() == ""){
    return {success:false , message : "Please Enter an Email"}
   }
   if(!emailReg.test(email)){
    return {success:false , message : "Please Enter an Valid Email Address"}
   }
   if(password.trim() == ""){
    return {success:false , message : "Please Enter Password"}
   }
   if(password.length < 8 ){
    return {success:false , message : "Please Enter Password of atleast 8 length"}
   }
   if(!passwordReg.test(password)){
    return {success:false , message : "Password Should Contains , at least one lowercase letter,uppercase letter,digit and special character"}
   }
   if(password != confirmPassword){
    return {success:false , message : "Confirm Password Doesn't match"}
   }
   try{
    await axiosUserInstance.get(`/${email}/exist`)
    return {success:true , message : "All correct"}
  }catch(err){
    if(err.response.status == 409 ){
      return {success:false , message : "This Email already Exists"}
     }
     if(err.response.status == 500){
      return {success:false , message : "Somthing Went Wrong , Please Try later"}
     }
  }
   
}
export {validateRegister}