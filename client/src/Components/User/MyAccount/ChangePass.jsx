import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { validateChangePass } from '../../../validations/accountValidation'
import { axiosUserInstance } from '../../../redux/Constants/axiosConstants'
import {  toast } from 'react-toastify';


function ChangePass({email}) {
    const [currentPass,setSetCurrentPass]=useState("")
    const [newPass,setNewPass]=useState("")
    const [confirmPass,setConfirmPass] = useState("")
    const navigate= useNavigate()
    
    const handleChangePass=async(e)=>{
     try{
        e.preventDefault()
        const result = validateChangePass(currentPass,newPass,confirmPass)
        if(result.success){
            await axiosUserInstance.put(`/${email}/change-pass`,{currentPass,newPass})
            toast.success("Successfully Updated")
        }else{
            toast.error(result.message)
        }
     }catch(err){
        toast.error(err?.response?.data?.message)
     }
    }
  return (
    
    <div>
        <h3 className="tab__header">Change Password</h3>
              <div className="tab__body">
                <form className="form grid" onSubmit={handleChangePass}>
                  <input type="password" placeholder="Current Password" 
                  className="form__input" 
                  value={currentPass}
                  onChange={(e)=>{setSetCurrentPass(e.target.value)}}
                  />
                  <input type="password" placeholder="New Password" className="form__input"
                  value={newPass}
                  onChange={(e)=>{setNewPass(e.target.value)}}
                  />
                  <input type="password" placeholder="Confirm Password" className="form__input" 
                  value={confirmPass}
                  onChange={(e)=>{setConfirmPass(e.target.value)}}
                  />
                  <div className="form__btn">
                  <span
                  onClick={
                    ()=>{
                      navigate('/forgotten-password/verify',{state:{origin:"my-account",email:email}})
                    }
                  } className='no-underline link-button' >Forgotten Password ? </span>
                  <br />
                    <button className="primary-btn">Save</button>
                  </div>
                </form>
              </div>
    </div>
  )
}

export default ChangePass