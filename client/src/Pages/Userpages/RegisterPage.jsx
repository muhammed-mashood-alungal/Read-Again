import React, { useEffect } from 'react'
import Register from '../../Components/User/Register/Register'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  const {isLoggedIn} = useSelector(state=>state.auth)
  const navigate= useNavigate()
  
  useEffect(()=>{
     if(isLoggedIn){
       navigate('/')
     }
  },[])

  return (
    <>
    <Register/>
    </>
  )
}

export default RegisterPage