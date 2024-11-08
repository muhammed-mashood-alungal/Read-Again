import React from 'react'
import Header from '../../Components/User/Header/Header'
import Banner from '../../Components/User/Banner/Banner'
import Categories from '../../Components/User/Categories/Categories'
import ProductList from '../../Components/User/ProductsList/ProductsList'
import Showcase from '../../Components/User/Showcase/Showcase'
import Footer from '../../Components/User/Footer/Footer'

function HomePage() {
  return (
   <>
      <Header/>
      <Banner/>
      <Categories/>
      <ProductList/>
      <Showcase/>
      <Footer/>
   </>
  )
}

export default HomePage