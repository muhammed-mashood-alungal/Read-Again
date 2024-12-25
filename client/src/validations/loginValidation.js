  function validateLogin(formData){
   const { email ,password } = formData
   const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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
   return {success:true , message : "All correct"}
   
}
export {validateLogin}