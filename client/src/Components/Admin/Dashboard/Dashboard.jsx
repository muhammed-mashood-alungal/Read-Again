import React, { useState } from 'react';
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
//import { CChartLine } from '@coreui/coreui-chartjs-react';

const Dashboard = () => {
  const salesData = {
    overallSalesCount: 1245,
    overallOrderAmount: 156789.50,
    overallDiscount: 15678.95,
    chartData: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Sales',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: 'rgba(76, 175, 80, 1)',
          pointBackgroundColor: 'rgba(76, 175, 80, 1)',
          data: [65, 59, 80, 81, 56, 55]
        },
        {
          label: 'Discounts',
          backgroundColor: 'rgba(244, 67, 54, 0.2)',
          borderColor: 'rgba(244, 67, 54, 1)',
          pointBackgroundColor: 'rgba(244, 67, 54, 1)',
          data: [28, 48, 40, 19, 86, 27]
        }
      ]
    }
  };


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
                <div className="fs-4 fw-semibold">{salesData.overallSalesCount}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={4}>
          <CCard>
            <CCardBody className="d-flex align-items-center">
              <CIcon icon={cilDollar} size="xl" className="me-3 text-success" />
              <div>
                <div className="text-medium-emphasis">Total Order Amount</div>
                <div className="fs-4 fw-semibold">${salesData.overallOrderAmount.toLocaleString()}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={4}>
          <CCard>
            <CCardBody className="d-flex align-items-center">
              <CIcon icon={cilChartLine} size="xl" className="me-3 text-warning" />
              <div>
                <div className="text-medium-emphasis">Total Discount</div>
                <div className="fs-4 fw-semibold">${salesData.overallDiscount.toLocaleString()}</div>
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
              {/* Date Range Filters */}
              <CForm className="mb-4">
                <CRow>
                  {/* <CCol md={4}>
                    <CFormSelect 
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="custom">Custom Range</option>
                    </CFormSelect>
                  </CCol> */}
                  {/* {dateRange === 'custom' && (
                    <>
                      <CCol md={4}>
                        <CFormInput 
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          placeholder="Start Date"
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormInput 
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          placeholder="End Date"
                        />
                      </CCol>
                    </>
                  )} */}
                </CRow>
              </CForm>

              {/* Generate Report Button */}
              {/* <CButton 
                color="primary" 
                onClick={generateSalesReport}
                className="mb-3"
              >
                <CIcon icon={cilFolderOpen} className="me-2" />
                 Generate Sales Report
                </CButton> */}

              <CCard className='mt-3'>
                 <SalesReport/>
              </CCard>

              {/* Sales Chart */}
              <CCard className="mt-3">
                <CCardBody>
                    <Chart/>
                  {/* <CChartLine
                    data={salesData.chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                    height={300}
                  /> */}
                </CCardBody>
              </CCard>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Recent Sales Table */}
      <CRow className="mt-4">
        <CCol>
          <CCard>
            <CCardHeader>Recent Sales</CCardHeader>
            <CCardBody>
              <CTable striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Order ID</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Discount</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>#12345</CTableDataCell>
                    <CTableDataCell>2024-01-15</CTableDataCell>
                    <CTableDataCell>$450.00</CTableDataCell>
                    <CTableDataCell>$45.00</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="success">Completed</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>#12346</CTableDataCell>
                    <CTableDataCell>2024-01-16</CTableDataCell>
                    <CTableDataCell>$350.00</CTableDataCell>
                    <CTableDataCell>$35.00</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="warning">Pending</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Dashboard;