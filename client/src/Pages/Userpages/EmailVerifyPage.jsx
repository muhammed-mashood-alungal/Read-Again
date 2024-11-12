import React from 'react'
import Header from '../../Components/User/Header/Header'
import EmailVerification from '../../Components/User/EmailVerification/EmailVerification'
import Footer from '../../Components/User/Footer/Footer'

function EmailVerifyPage(props) {
  return (
    <>
     <EmailVerification  {...props}/>
    </>
  )
}

export default EmailVerifyPage