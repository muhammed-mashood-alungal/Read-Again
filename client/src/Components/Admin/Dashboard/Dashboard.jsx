import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilCart, 
  cilDollar, 
  cilChartLine, 
  cilFolderOpen, 
  cilFilter 
} from '@coreui/icons';
import Chart from './Chart';

import { axiosAdminInstance } from '../../../redux/Constants/axiosConstants';
import SalesReport from './SalesReport';
import { toast } from 'react-toastify';
import TopSales from './TopSales';
//import { CChartLine } from '@coreui/coreui-chartjs-react';

const Dashboard = () => {
  
   const [overall,setOverall] = useState({})
   useEffect(()=>{
     const fetchOverallState=async()=>{
        try{
          const {data} = await axiosAdminInstance.get('/overall-stats')
          setOverall(data.overall)
        }catch(err){
            toast.error(err?.response?.data?.message)
        }
     }
     fetchOverallState()
   },[])

  return (
    <CContainer>
      <CRow>
        <CCol xs={12}>
          <h1 className="my-4">Admin Dashboard</h1>
        </CCol>
      </CRow>

      {/* Key Metrics */}
      <CRow>
        <CCol sm={4}>
          <CCard>
            <CCardBody className="d-flex align-items-center">
              <CIcon icon={cilCart} size="xl" className="me-3 text-primary" />
              <div>
                <div className="text-medium-emphasis">Overall Sales Count</div>
                <div className="fs-4 fw-semibold">{overall.salesCount}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={4}>
          <CCard>
            <CCardBody className="d-flex align-items-center">
              <CIcon icon={cilDollar} size="xl" className="me-3 text-success" />
              <div>
                <div className="text-medium-emphasis">Total Orders</div>
                <div className="fs-4 fw-semibold">{overall.orderCount}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={4}>
          <CCard>
            <CCardBody className="d-flex align-items-center">
              <CIcon icon={cilDollar} size="xl" className="me-3 text-success" />
              <div>
                <div className="text-medium-emphasis">Total Discount</div>
                <div className="fs-4 fw-semibold">{overall.totalDiscount}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={4}>
          <CCard>
            <CCardBody className="d-flex align-items-center">
              <CIcon icon={cilChartLine} size="xl" className="me-3 text-warning" />
              <div>
                <div className="text-medium-emphasis">Total Users</div>
                <div className="fs-4 fw-semibold">{overall.userCount}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Sales Report Section */}
      <CRow className="mt-4">
        <CCol>
          <CCard>
            <CCardHeader>Sales Report</CCardHeader>
            <CCardBody>
          
              <CCard className='mt-3'>
                 <SalesReport/>
              </CCard>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
     <CCard className='mt-3'>
      <TopSales/>
     </CCard>
    </CContainer>
  );
};

export default Dashboard;