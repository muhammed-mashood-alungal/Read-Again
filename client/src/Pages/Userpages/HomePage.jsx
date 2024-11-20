import React, { Suspense, useEffect, useState } from 'react'
import Header from '../../Components/User/Header/Header'
import Banner from '../../Components/User/Banner/Banner'
import Categories from '../../Components/User/Categories/Categories'
import ProductList from '../../Components/User/ProductsList/ProductsList'
import Showcase from '../../Components/User/Showcase/Showcase'
import Footer from '../../Components/User/Footer/Footer'
<<<<<<< HEAD
import { axiosBookInstance } from '../../redux/Constants/axiosConstants'

function HomePage() {
  const [justPublished,setJustPublished] = useState([])
=======
import { axiosAdminInstance, axiosAuthInstance, axiosBookInstance } from '../../redux/Constants/axiosConstants'
import { useDispatch } from 'react-redux'
import { removeAuth, setAuth } from '../../redux/Actions/userActions'

function HomePage() {
  const [justPublished,setJustPublished] = useState([])
  const dispatch = useDispatch()
  useEffect(() => {
    const checkAuth = async () => {
        try {
            const response = await axiosAuthInstance.get('/check-auth');
            dispatch(setAuth({isLoggedIn : response.data.isLoggedIn , role : response.data.role}));
        } catch (error) {
            console.error('Token verification failed:', error);
            dispatch(removeAuth());
        }
    };
    checkAuth();
}, [dispatch]);

>>>>>>> dc5bdfea52910490befd6242471e3f6164bc8958
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