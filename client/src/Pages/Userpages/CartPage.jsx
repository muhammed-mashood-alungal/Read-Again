import React, { useEffect, useState } from 'react'
import Header from '../../Components/User/Header/Header'
import ShoppingCart from '../../Components/User/CartItems/ShoppingCart'
import Footer from '../../Components/User/Footer/Footer'

function CartPage() {
 
  return (
    <>
    <Header/>
    <ShoppingCart/>
    <Footer/>
    </>
  )
}

export default CartPage