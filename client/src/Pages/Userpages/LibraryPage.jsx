import React, { useEffect, useState } from 'react'
import Header from '../../Components/User/Header/Header'
import ProductList from '../../Components/User/ProductsList/ProductsList'
import Footer from '../../Components/User/Footer/Footer'
import ProductFilter from '../../Components/User/ProductFilter/ProductFilter'
import Breadcrumbs from '../../Components/User/Breadcrumb/Breadcrump'
import { axiosBookInstance } from '../../redux/Constants/axiosConstants'
function LibraryPage() {
const [justPublished,setJustPublished]=useState([])
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
    <Breadcrumbs/>
    <ProductList books={justPublished} title={'Just Published'}/>
    <Footer/>
    </>
  )
}

export default LibraryPage