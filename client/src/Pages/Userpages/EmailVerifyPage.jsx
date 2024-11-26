import React, { useEffect } from 'react'
import Header from '../../Components/User/Header/Header'
import EmailVerification from '../../Components/User/EmailVerification/EmailVerification'
import Footer from '../../Components/User/Footer/Footer'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

function EmailVerifyPage(props) {
  const {isLoggedIn} = useSelector(state=>state.auth)
  const navigate= useNavigate()
  const location = useLocation();
  const origin = location.state?.origin;
  const userEmail = location.state?.userEmail; 

  useEffect(()=>{
    console.log(origin)
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