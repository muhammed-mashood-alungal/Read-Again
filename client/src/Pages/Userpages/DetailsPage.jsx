import React, { Suspense, useEffect, useState } from 'react'
import Header from '../../Components/User/Header/Header'
import Footer from '../../Components/User/Footer/Footer'
import ProductDetails from '../../Components/User/ProductDetails/ProductDetails'
import { useParams } from 'react-router-dom'
import { axiosBookInstance } from '../../redux/Constants/axiosConstants'
import ProductList from '../../Components/User/ProductsList/ProductsList'
import { toast } from 'react-toastify'
import ProductLoading from '../../Components/LoadingComponents/ProductsLoading'

function DetailsPage() {
  const {bookId} = useParams()
  const [bookData,setBookData] = useState({})
  const [related,setRelated]=useState([])
  useEffect(()=>{
    const fetchBookDetails=async(bookId)=>{
      try{
        const response = await axiosBookInstance.get(`/${bookId}`)
        setBookData(response.data.bookData)
      }catch(err){
        toast.error(err)
      }
    }
    fetchBookDetails(bookId)
  },[bookId])

  useEffect(()=>{
    const fetchRelatedList=async(bookData)=>{
      try{
        const tags=[
          {author:bookData.author},
          {category:bookData.category}
        ]

        const response = await axiosBookInstance.post(`/list/related-books/${bookId}`,{tags})
        setRelated(response.data.books)
      }catch(err){
        console.log(err)
      }
    }
    fetchRelatedList(bookData)
  },[bookData])
  
  return (
    <>
     <Header/>
     <ProductDetails bookData={bookData}/>
     <Suspense fallback={<ProductLoading/>}>  
     <ProductList books={related} title={'Related Books'}/>
     </Suspense>    
     <Footer/>
    </>
  )
}

export default DetailsPage