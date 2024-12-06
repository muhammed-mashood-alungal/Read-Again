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
const [searchQuery,setSearchQuery]=useState("")
const [count,setCount]=useState(0)
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
  
  },[filterQuery,count])
  
  const updateQuery=(query)=>{
     setFilterQuery(query)
  }

  const onSearch=(name)=>{
    if(name.trim()){
      setJustPublished(books=>{
        return  books.filter((book)=>{
           return  book.title.includes(name)
          })
        })
    }else{
      setCount(count+1)
    }
   
  }
  return (
    <>
    <Header />
    <Breadcrumbs/>
    <ProductFilter onFilter={updateQuery} setSearchQuery={onSearch}/>
    <ProductList books={justPublished} title={''}/>
    <Footer/>
    </>
  )
}

export default LibraryPage