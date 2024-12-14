import React, { useState, useEffect } from 'react';
import './ListCategories.css';
import { Col, Container, Row } from 'reactstrap';
import { axiosAdminInstance, axiosCategoryInstance, axiosUserInstance } from '../../../../redux/Constants/axiosConstants'
import CategoryForm from '../CategoryForm/CategoryForm';
import { categoryImages } from '../../../../redux/Constants/imagesDir';
import ConfirmationModal from '../../../ConfirmationModal/ConfirmationModal';
import { CButton, CTable } from '@coreui/react';
import { toast } from 'react-toastify';
import CIcon from '@coreui/icons-react';
import { cilArrowThickFromRight } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({})
  const [err, setErr] = useState("")
  const [isChildUpdated, setIsChildUpdated] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [currentAction, setCurrrentAction] = useState("list-categories")
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axiosCategoryInstance.get('/')
        if (response.status == 200) {
          setCategories(response.data.categories)
        }
      } catch (err) {
        setErr(err.response.data.message)
      }
    }
    fetchCategories()

  }, [isChildUpdated])

  const handleChildUpdate = (updated) => {
    setIsChildUpdated(!isChildUpdated);
  };

  const handleCategoryListing = async () => {
    try {
      await axiosCategoryInstance.put(`/${selectedCategoryId}/list-or-unlist`)
      setCategories(categories => {
        return categories.map((category) => {
          return category._id == selectedCategoryId ? { ...category, listed: !category.listed } : category
        })
      })
    } catch (err) {
      setErr(err?.response?.data?.message)
    } finally {
      setSelectedCategoryId(null)
    }
  };
  const showUpdateForm = async (id) => {
    try {
      const response = await axiosCategoryInstance.get(`/${id}`)
      console.log(response.data.categoryData)
      setCategoryData(response.data.categoryData)
      setCurrrentAction("update")
    } catch (err) {
      toast.error("Something went Wrong")
    }
  }
  const handleSearch = async (e) => {
    try {
      const query = e.target.value
      const response = await axiosCategoryInstance.get(`/?name=${query}`)
      if (response.status == 200) {
        setCategories(response.data.categories)
      }
    } catch (err) {
      toast.error(err.response.data.message)
    }
  }
  const confirmAction = (categoryId) => {
    setSelectedCategoryId(categoryId)
  }


  const onCancel = () => {
    setSelectedCategoryId(null)
  }


  return (
    <Container className='content'>  
      <Row className="category-management">
         <Col>
            {selectedCategoryId &&
              <ConfirmationModal
                title={`Are You Sure to Proceed ?`}
                onConfirm={handleCategoryListing}
                onCancel={onCancel} />
            }
            <div className="row p-3">
              <div className="col-12 grid-margin">
                <div className="card category-table">
                  <div className="card-body">
                    <div className='d-flex  justify-content-between'>
                      <h4 className="table-title">All Categories</h4>
                      <CButton onClick={() => {navigate('/admin/category/form') }}
                        color="success"
                        variant="outline">
                        Add Category
                      </CButton>
                    </div>
                    <form className="nav-link mt-2 mt-md-0 d-lg-flex search">
                      <input
                        type="text"
                        className="form-control mt-1"
                        placeholder="Search categories"
                        onChange={handleSearch}
                      />
                    </form>
                    <br />
                    <div className="table-responsive">

                    <CTable striped> 
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
                                <img src={categoryImages + category.image} alt="Category" className="category-image" />

                              </td>
                              <td>{category.name}</td>
                              <td>{category.createdAt}</td>
                              <td>{category.updatedAt}</td>
                              <td>
                                <CButton color="success" variant="outline"
                                  onClick={() => navigate('/admin/category/form',{state:{categoryData:category}})}
                                >
                                  Update
                                </CButton>
                              </td>
                              <td>
                               <CButton color="danger" variant="outline"
                                  onClick={() => confirmAction(category._id)}
                                >
                                  {category.listed ? "Unlist" : "list"}
                                </CButton>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </CTable>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
      </Row>
    </Container>
  );
};

export default CategoryManagement;
