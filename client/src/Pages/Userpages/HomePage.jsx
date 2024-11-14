import React, { Suspense, useEffect, useState } from 'react'
import Header from '../../Components/User/Header/Header'
import Banner from '../../Components/User/Banner/Banner'
import Categories from '../../Components/User/Categories/Categories'
import ProductList from '../../Components/User/ProductsList/ProductsList'
import Showcase from '../../Components/User/Showcase/Showcase'
import Footer from '../../Components/User/Footer/Footer'
import { axiosBookInstance } from '../../redux/Constants/axiosConstants'

function HomePage() {
  const [justPublished,setJustPublished] = useState([])
  useEffect(()=>{
    const fetchProducts =async ()=>{
      try{
        const response= await axiosBookInstance.get('/list/just-published')
        console.log(response.data.books)
        setJustPublished(response.data.books)
      }catch(err){
        console.log(err)
      }
    }
    fetchProducts()
  
  },[])
  return (
   <>
      <Header/>
      <Banner/>

      <Suspense fallback={<h1>Loading</h1>}>
      <Categories/>
      </Suspense>
     
      <Suspense fallback={<h1>Loading</h1>}>
      <ProductList books={justPublished} title={'Just Published'}/>
      </Suspense>
      
      
      <Showcase/>
      <Footer/>
   </>
  )
}

export default HomePage