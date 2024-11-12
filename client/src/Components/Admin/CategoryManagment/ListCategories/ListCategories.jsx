import React, { useState, useEffect } from 'react';
import './ListCategories.css';
import { Col, Container, Row } from 'reactstrap';
import AddCategories from '../CategoryForm/CategoryForm'
const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
   

  useEffect(() => {
    // Fetch categories on component mount (replace URL with your API endpoint)
    fetch('/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);


 

  const handleUpdateCategory = (id) => {
    // Update category API call
    console.log('Updating category:', id);
  };

  const handleDeleteCategory = (id) => {
    // Delete category API call
    console.log('Deleting category:', id);
  };

  return (
    <Container className='content'>
    <Row className="category-management">
      <Col md={8}>
      <h4 className="title">Category Management</h4>

      <div className="row p-3">
        <div className="col-12 grid-margin">
          <div className="card category-table">
            <div className="card-body">
              <h4 className="table-title">Order Status</h4>
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
                      <th>Name</th>
                      <th>Products Count</th>
                      <th>Created Date</th>
                      <th>Updated Date</th>
                      <th>Update</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(category => (
                      <tr key={category.id}>
                        <td>
                          <img src={category.image} alt="Category" className="category-image" />
                          <span>{category.name}</span>
                        </td>
                        <td>{category.productCount}</td>
                        <td>{category.createdDate}</td>
                        <td>{category.updatedDate}</td>
                        <td>
                          <div
                            className="badge badge-outline-success"
                            onClick={() => handleUpdateCategory(category.id)}
                          >
                            Update
                          </div>
                        </td>
                        <td>
                          <div
                            className="badge badge-outline-danger"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            Delete
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
    <Col md={4} className='right-sidebar'>
      <AddCategories/>
    </Col>
    </Row>
    </Container>
  );
};

export default CategoryManagement;
