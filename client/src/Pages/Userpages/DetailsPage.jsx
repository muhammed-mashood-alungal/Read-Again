import React, { Suspense, useEffect, useState } from 'react'
import Header from '../../Components/User/Header/Header'
import Footer from '../../Components/User/Footer/Footer'
import ProductDetails from '../../Components/User/ProductDetails/ProductDetails'
import { useParams } from 'react-router-dom'
import { axiosBookInstance } from '../../redux/Constants/axiosConstants'
import ProductList from '../../Components/User/ProductsList/ProductsList'
import Breadcrumb from '../../Components/User/Breadcrumb/Breadcrump'

function DetailsPage() {
  const {bookId} = useParams()
  const [bookData,setBookData] = useState({})
  const [related,setRelated]=useState([])
  useEffect(()=>{
    const fetchBookDetails=async(bookId)=>{
      try{
        const response = await axiosBookInstance.get(`/${bookId}`)
        setBookData(response.data.bookData)
        console.log(response.data.bookData)
      }catch(err){
        console.log(err)
      }
    }
    fetchBookDetails(bookId)
  },[bookId])

  useEffect(()=>{
    const fetchRelatedList=async(bookData)=>{
      try{
        const tags=[
          {author:bookData.author},
          {genre:bookData.genre},
          {category:bookData.category}
        ]

        const response = await axiosBookInstance.post(`/list/related-books/${bookId}`,{tags})
        console.log(response.data.books)
        setRelated(response.data.books)
        console.log(response.data.books)
      }catch(err){
        console.log(err)
      }
    }
    fetchRelatedList(bookData)
  },[bookData])
  
  return (
    <>
     <Header/>
     <Breadcrumb idName={bookData.title}/>
     <ProductDetails bookData={bookData}/>
     <Suspense fallback={<h1>loading...</h1>}>  
     <ProductList books={related} title={'Related Books'}/>
     </Suspense>
     
     <Footer/>
    </>
  )
}

export default DetailsPage