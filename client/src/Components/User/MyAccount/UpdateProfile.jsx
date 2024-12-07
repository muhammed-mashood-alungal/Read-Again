import React, { useEffect, useState } from 'react'
import { axiosUserInstance } from '../../../redux/Constants/axiosConstants'
import {  toast } from 'react-toastify';
import { validateUpdateProfile } from '../../../validations/accountValidation';
import {useDispatch} from 'react-redux'
import {getOtp} from '../../../redux/Actions/userActions'
import { useNavigate } from 'react-router-dom';

function UpdateProfile({profileData}) {
  const [username, setUsername] = useState(profileData?.username)
  const [email,setEmail] = useState(profileData?.email)
  const [phone,setPhone] = useState(profileData?.phone)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(()=>{
   if(profileData){
    setUsername(profileData?.username)
    setEmail(profileData?.email)
   }
  },[profileData])
  const handleUpdateProfile=async(e)=>{
    try{
        e.preventDefault()
        const formData={
          _id:profileData._id,
          username,  
          email
        }
        const result = await validateUpdateProfile(formData,profileData.email)
        if(result.success){
          if(profileData.email != email){
            dispatch(getOtp(formData.email))
            navigate('/register/verify' , { state: { origin: 'profile' , userData : {...formData}} })
          }else{
            try{
              await axiosUserInstance.put(`/${formData?._id}/edit`,formData)
              toast.success("Updated Successfully")
            }catch(err){
              console.log(err)
            }
          }
                
        }else{
          toast.error(result?.message)
        }
      
    }catch(err){
        toast.error(err?.response?.data?.message)
        console.log(err)
    }
  }

 
 
  return (
   <>
    <h3 className="tab__header">Update Profile</h3>
              <div className="tab__body">
                <form className="form grid" onSubmit={handleUpdateProfile}>
                  <input type="text" 
                  placeholder="Username" 
                  className="form__input"
                  value={username}
                  onChange={(e)=>{setUsername(e.target.value)}} 
                  />
                  <input type="text" 
                  placeholder="Email Address" 
                  className="form__input" 
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  />
                
                  <div className="form__btn">
                    <button className="primary-btn" role='submit'>Save</button>
                  </div>
                </form>
    </div>
   </>
             
        
  )
}

export default UpdateProfile