import React, { useEffect } from 'react'
import UserLogin from '../../Components/User/UserLogin/UserLogin'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from '../../Components/User/Header/Header'

function LoginPage() {
  const {isLoggedIn} = useSelector(state=>state.auth)
  const navigate= useNavigate()

  useEffect(()=>{
     if(isLoggedIn){
       navigate('/')
     }
  },[])

  return (
    <>
    <Header/>
    <UserLogin/>
    </>
  )
}

export default LoginPage