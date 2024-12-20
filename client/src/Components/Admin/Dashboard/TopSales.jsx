import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CProgress
} from '@coreui/react';
import { axiosAdminInstance } from '../../../redux/Constants/axiosConstants';
import { toast } from 'react-toastify';

const TopSales = () => {
  const [topBooks, setTopBooks]=useState([])
  const [topCategories,setTopCategories]=useState([])
  const [topAuthors,setTopAuthors]=useState([])
    useEffect(()=>{
      async function fetchTopSalesReport(){
        try{
            const {data} = await axiosAdminInstance.get('/top-selling')
             setTopBooks(data.topBooks)
             setTopCategories(data.topCategories)
             setTopAuthors(data.topAuthors)
        }catch(err){
            toast.error("Something Went Wrong")
        }
      }
      fetchTopSalesReport()
    },[])

  return (
    <CRow>
      <CCol xs={12} lg={4}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Top 10 Best-Selling Books</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#Index</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Product</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Sales</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {topBooks.map((product, index) => (
                  <CTableRow key={product._id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{product.title}</CTableDataCell>
                    <CTableDataCell>{product.totalSold}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12} lg={4}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Top 10 Best-Selling Categories</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#Index</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Sales</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {topCategories.map((category, index) => (
                  <CTableRow key={category._id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{category.categoryDetails.name}</CTableDataCell>
                    <CTableDataCell>{category.total}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12} lg={4}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Top 10 Best Authors</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#Index</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Product</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Sales</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {topAuthors.map((author, index) => (
                  <CTableRow key={author._id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{author._id}</CTableDataCell>
                    <CTableDataCell>{author.total}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default TopSales;