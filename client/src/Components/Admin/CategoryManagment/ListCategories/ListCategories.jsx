import React, { useState, useEffect } from 'react';
import './ListCategories.css';
import { Col, Container, Row } from 'reactstrap';
import {axiosAdminInstance, axiosUserInstance} from '../../../../redux/Constants/axiosConstants'
import CategoryForm from '../CategoryForm/CategoryForm';
import { categoryImages } from '../../../../redux/Constants/imagesDir';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [categoryData , setCategoryData] =useState({})
  const [err, setErr] = useState("")
  const [isChildUpdated, setIsChildUpdated] = useState(false);
  useEffect(()=>{
    async function fetchCategories(){
      try{
        const response = await axiosAdminInstance.get('/categories')
        if(response.status == 200){
          setCategories(response.data.categories)
        }
       }catch(err){
          setErr(err.response.data.message)
       }
    }
    fetchCategories()
   
  },[isChildUpdated])

  const handleChildUpdate = (updated) => {
    setIsChildUpdated(!isChildUpdated);
  };

  const handleCategoryListing =async (id) => {
    try{
      console.log(id)
      await axiosAdminInstance.put(`/categories/${id}/list-or-unlist`)
      setCategories(categories=>{
        return categories.map((category)=>{
         return  category._id == id ? {...category,listed:!category.listed} : category
        })
      })
    }catch(err){
      setErr(err?.response?.data?.message)
    }
  };
  const showUpdateForm = async(id) =>{
    try{
      console.log(id) 
    const response = await  axiosAdminInstance.get(`categories/${id}`)
    console.log(response.data.categoryData)
    setCategoryData(response.data.categoryData)
    }catch(err){
      setErr("Something went Wrong")
    }
    
  }  
  

  return (
    <Container className='content'>
    <Row className="category-management">
      <Col md={8}>
      <h4 className="title">Category Management</h4>
      {err && <p>{err}</p> }
      <div className="row p-3">
        <div className="col-12 grid-margin">
          <div className="card category-table">
            <div className="card-body">
              <h4 className="table-title">All Categories</h4>
              <form className="nav-link mt-2 mt-md-0 d-lg-flex search">
                  <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="Search categories"
                  />
                  <button
                    className="primary-btn"
                  >
                    Search
                  </button>
                </form>
                <br />
              <div className="table-responsive">
                
                <table className="table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Category Name</th>
                      <th>Created Date</th>
                      <th>Updated Date</th>
                      <th>Update</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(category => (
                      <tr key={category._id}>
                        <td>
                          <img src={categoryImages+category.image} alt="Category" className="category-image" />
                          
                        </td>
                        <td>{category.name}</td>
                        <td>{category.createdAt}</td>
                        <td>{category.updatedAt}</td>
                        <td>
                          <div
                            className="badge badge-outline-success action-btn"
                            onClick={() => showUpdateForm(category._id)}
                          >
                            Update
                          </div>
                        </td>
                        <td>
                          <div
                            className="badge badge-outline-danger action-btn"
                            onClick={() => handleCategoryListing(category._id)}
                          >
                            {category.listed ?  "Unlist" : "list"} 
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Col>
    <Col md={4} >
    <div className='right-sidebar'>
   {categoryData ? <CategoryForm categoryData={categoryData} onChildUpdate={handleChildUpdate}/> : 
   <CategoryForm onChildUpdate={handleChildUpdate}/>}
   </div>
    </Col>
    </Row>
    </Container>
  );
};

export default CategoryManagement;