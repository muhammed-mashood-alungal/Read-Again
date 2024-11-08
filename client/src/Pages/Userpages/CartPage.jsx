import React from 'react'
import Header from '../../Components/User/Header/Header'
import ShoppingCart from '../../Components/User/CartItems/ShoppingCart'
import Footer from '../../Components/User/Footer/Footer'
import CartActions from '../../Components/User/CartActions/CartActions'

function CartPage() {
  return (
    <>
    <Header/>
    <ShoppingCart/>
    <CartActions/>
    <Footer/>
    </>
  )
}

export default CartPage