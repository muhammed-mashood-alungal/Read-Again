import React from 'react'
import Checkout from '../../Components/User/CheckOut/CheckOut'
import Header from '../../Components/User/Header/Header'
import Footer from '../../Components/User/Footer/Footer'
import Breadcrumb from '../../Components/User/Breadcrumb/Breadcrump'


function CheckOutPage() {
  return (
    <>
    <Header/>
    {/* <Breadcrumb/> */}
    <Checkout/>
    <Footer/>
    </>
     
  )
}

export default CheckOutPage