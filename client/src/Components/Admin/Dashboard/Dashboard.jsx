import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilCart,
  cilDollar,
  cilChartLine
} from '@coreui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { axiosAdminInstance } from '../../../redux/Constants/axiosConstants';
import SalesReport from './SalesReport';
import { toast } from 'react-toastify';
import TopSales from './TopSales';

const Dashboard = () => {

  const [overall, setOverall] = useState({})
  useEffect(() => {
    const fetchOverallState = async () => {
      try {
        const { data } = await axiosAdminInstance.get('/overall-stats')
        setOverall(data.overall)
      } catch (err) {
        toast.error(err?.response?.data?.message)
      }
    }
    fetchOverallState()
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol xs={12}>
          <h1 className="my-4">Admin Dashboard</h1>
        </CCol>
      </CRow>


      <CRow>
        <CCol sm={3}>
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
        <CCol sm={3}>
          <CCard>
            <CCardBody className="d-flex align-items-center">
              <FontAwesomeIcon icon={faIndianRupeeSign} className="me-3 text-success" size="xl" />
              <div>
                <div className="text-medium-emphasis">Total Orders</div>
                <div className="fs-4 fw-semibold">{overall.orderCount}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
          <CCard>
            <CCardBody className="d-flex align-items-center">
              <FontAwesomeIcon icon={faIndianRupeeSign} className="me-3 text-success" size="xl" />
              <div>
                <div className="text-medium-emphasis">Total Discount</div>
                <div className="fs-4 fw-semibold">{overall.totalDiscount}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
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


      <CRow className="mt-4">
        <CCol>
          <CCard>
            <CCardHeader>Sales Report</CCardHeader>
            <CCardBody>

              <CCard className='mt-3'>
                <SalesReport />
              </CCard>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CCard className='mt-3'>
        <TopSales />
      </CCard>
    </CContainer>
  );
};

export default Dashboard;