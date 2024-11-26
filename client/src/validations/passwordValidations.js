export function validateChangePassword(newPass,confirmPass){
    const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
       if(newPass.trim() == ""){
        return {success:false , message : "Please Enter Current and New Passwords"}
       }
       if(newPass.length < 8 ){
        return {success:false , message : "Please Enter Password of atleast 8 length"}
       }
       if(!passwordReg.test(newPass)){
        return {success:false , message : "Password Should Contains , at least one lowercase letter,uppercase letter,digit and special character"}
       }
       if(newPass != confirmPass){
        return {success:false , message : "Confirm Password doesn't match"}
       }
       return {success:true}
}