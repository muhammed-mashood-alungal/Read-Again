import React, { useEffect, useState } from 'react';
import './Categories.css'; 
import { axiosAdminInstance, axiosCategoryInstance } from '../../../redux/Constants/axiosConstants';
import { Link } from 'react-router-dom';
import { categoryImages } from '../../../redux/Constants/imagesDir';

const CategoriesSection = () => {
  const [categories,setCategories] = useState([])
  const [err,setErr] = useState("")
  useEffect(()=>{
    async function fetchCategories(){
      try{
        const response = await axiosCategoryInstance.get('/listed')
        setCategories(response.data.categories)
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
          return <Link to={'/library'} className="category__item">
                   <img src={categoryImages+category.image} alt="" className="category__img" />
                   <h3 className="category__title">{category.name}</h3>
                 </Link>
        })
      }
      </div>
    </section>
  );
};

export default CategoriesSection;
