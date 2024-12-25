import React, { useEffect } from 'react'
import EmailVerification from '../../Components/User/EmailVerification/EmailVerification'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

function EmailVerifyPage() {
  const {isLoggedIn} = useSelector(state=>state.auth)
  const navigate= useNavigate()
  const location = useLocation();
  const origin = location.state?.origin;

  useEffect(()=>{
     if(isLoggedIn && !origin){
       navigate('/')
     }
  },[])

  return (
    <>
     <EmailVerification/>
    </>
  )
}

export default EmailVerifyPage