import React, { Suspense, useEffect, useState } from 'react'
import Header from '../../Components/User/Header/Header'
import Banner from '../../Components/User/Banner/Banner'
import Showcase from '../../Components/User/Showcase/Showcase'
import Footer from '../../Components/User/Footer/Footer'
import { axiosAdminInstance, axiosAuthInstance, axiosBookInstance } from '../../redux/Constants/axiosConstants'
import { useDispatch } from 'react-redux'
import { removeAuth, setAuth } from '../../redux/Actions/userActions'
import ProductLoading from '../../Components/LoadingComponents/ProductsLoading'
import CategoryLoading from '../../Components/LoadingComponents/CategoryLoading'

function HomePage() {
  const [justPublished, setJustPublished] = useState([])
  const [showCaseData, setShowCaseData] = useState([])
  const dispatch = useDispatch()
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosAuthInstance.get('/check-auth');
        dispatch(setAuth(response.data));
      } catch (error) {
        console.error('Token verification failed:', error);
        dispatch(removeAuth());
      }
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosBookInstance.get('/list/just-published')
        console.log(response.data.books)
        setJustPublished(response.data.books)
      } catch (err) {
        console.log(err)
      }
    }
    fetchProducts()

  }, [])

  useEffect(() => {
    const fecthShowCase = async () => {
      try {
        const response = await axiosBookInstance.get('/list/get-showcase-data')
        console.log(response.data['showcaseData'])
        setShowCaseData(response.data['showcaseData'])
      } catch (err) {
        console.log(err)
      }
    }
    fecthShowCase()

  }, [])
  const Categories = React.lazy(() => import('../../Components/User/Categories/Categories'))
  const ProductList = React.lazy(() => import('../../Components/User/ProductsList/ProductsList'))
  return (
    <>
      <Header />
      <Banner />
      <Suspense fallback={<CategoryLoading />}>
        <Categories />
      </Suspense>
      <Suspense fallback={<ProductLoading />}>
        <ProductList books={justPublished} title={'Just Published'} />
      </Suspense>
      <Showcase data={showCaseData} />
      <Footer />
    </>
  )
}

export default HomePage