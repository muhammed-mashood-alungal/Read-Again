import React, { useEffect } from 'react'
import Register from '../../Components/User/Register/Register'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from '../../Components/User/Header/Header'

function RegisterPage() {
  const { isLoggedIn } = useSelector(state => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [])

  return (
    <>
      <Header />
      <Register />
    </>
  )
}

export default RegisterPage