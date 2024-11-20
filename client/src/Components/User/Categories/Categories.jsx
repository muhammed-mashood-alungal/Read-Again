import React, { useEffect, useState } from 'react';
import './Categories.css'; 
<<<<<<< HEAD
import { axiosAdminInstance } from '../../../redux/Constants/axiosConstants';
=======
import { axiosAdminInstance, axiosCategoryInstance } from '../../../redux/Constants/axiosConstants';
>>>>>>> dc5bdfea52910490befd6242471e3f6164bc8958
import { Link } from 'react-router-dom';
import { categoryImages } from '../../../redux/Constants/imagesDir';

const CategoriesSection = () => {
  const [categories,setCategories] = useState([])
  const [err,setErr] = useState("")
  useEffect(()=>{
    async function fetchCategories(){
      try{
<<<<<<< HEAD
        const response = await axiosAdminInstance.get('/categories')
        if(response.status == 200){
          setCategories(response.data.categories)
        }
=======
        const response = await axiosCategoryInstance.get('/listed')
        setCategories(response.data.categories)
>>>>>>> dc5bdfea52910490befd6242471e3f6164bc8958
       }catch(err){
          setErr(err.response?.data?.message)
       }
    }
    fetchCategories()
  },[])
  return (
    <section className="categories container section">
      <h3 className="section__title">
        <span>Popular</span> Categories
      </h3>
      <div className="categories__container">
      {
        categories && categories.map((category)=>{
<<<<<<< HEAD
          return <Link to={'/library'} className="category__item">
                   <img src={categoryImages+category.image} alt="" className="category__img" />
                   <h3 className="category__title">{category.name}</h3>
=======
          return <Link to={'/library'} className="category__item no-underline">
                   <img src={categoryImages+category.image} alt="" className="category__img" />
                   <h3 className="category__title no-underline">{category.name}</h3>
>>>>>>> dc5bdfea52910490befd6242471e3f6164bc8958
                 </Link>
        })
      }
      </div>
    </section>
  );
};

export default CategoriesSection;
