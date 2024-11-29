import React, { useEffect, useState } from 'react'
import Header from '../../Components/User/Header/Header'
import ProductList from '../../Components/User/ProductsList/ProductsList'
import Footer from '../../Components/User/Footer/Footer'
import ProductFilter from '../../Components/User/ProductFilter/ProductFilter'
import Breadcrumbs from '../../Components/User/Breadcrumb/Breadcrump'
import { axiosBookInstance } from '../../redux/Constants/axiosConstants'
function LibraryPage() {
const [justPublished,setJustPublished]=useState([])
const [filterQuery, setFilterQuery]=useState('')
  useEffect(()=>{
    const fetchProducts =async ()=>{
      try{
        const response= await axiosBookInstance.get(`/list/filtered-books/${filterQuery}`)
        console.log(response.data.books)
        setJustPublished(response.data.books)
      }catch(err){
        console.log(err)
      }
    }
    fetchProducts()
  
  },[filterQuery])
  
  const updateQuery=(query)=>{
    console.log(query)
     setFilterQuery(query)
  }
  return (
    <>
    <Header/>
    <Breadcrumbs/>
    <ProductFilter onFilter={updateQuery}/>
    <ProductList books={justPublished} title={''}/>
    <Footer/>
    </>
  )
}

export default LibraryPage