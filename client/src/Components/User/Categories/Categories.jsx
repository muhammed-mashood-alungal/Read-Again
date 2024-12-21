import React, { useEffect, useState } from 'react';
import './Categories.css'; 
import { axiosAdminInstance, axiosCategoryInstance } from '../../../redux/Constants/axiosConstants';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardImg, Col, Row } from 'reactstrap';

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
      <Row className="justify-content-between g-4">
      {categories?.map((category) => (
        <Col xs="6" md="2" key={category.name}>
          <Link 
            to={`/library/?category=${category.name}`} 
            className="text-decoration-none"
          >
            <Card className="h-100 shadow-sm hover-shadow">
              <CardImg
                top
                src={category?.image?.secure_url}
                alt={category.name}
                className="category-img p-3"
              />
              <CardBody className="p-2">
                <h3 className="text-center mb-2 h6">
                  {category.name}
                </h3>
              </CardBody>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
      
      </div>
    </section>
  );
};

export default CategoriesSection;
