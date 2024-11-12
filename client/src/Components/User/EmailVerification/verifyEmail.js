import { axiosUserInstance } from "../../../redux/Constants/axiosConstants"

export const verifyEmail= async(email)=>{
    try{
        await axiosUserInstance.get(`/${email}/verify-exist`)
        return true
      }catch(err){
        if(err?.response?.status == 409 ){
          return false
         }
      }
}
