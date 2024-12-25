import React, { useState, useMemo, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormSelect,
  CFormInput,
  CBadge,
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { axiosAdminInstance } from '../../../redux/Constants/axiosConstants'
import {  PDFDownloadLink } from '@react-pdf/renderer';
import SalesPDFDocument from './SalesPDFDocument'
import { toast } from 'react-toastify'
import Chart from './Chart'

const SalesReport = () => {
  const [dateRange, setDateRange] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesReport, setSalesReport] = useState({
    filterType: 'daily',
    totalRevenue: 0,
    totalCouponDiscount: 0,
    totalSales: 0,
    itemsSold: 0,
    orders: []
  })
  const [chartData , setChartData]=useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOrders = useMemo(() => {
    return salesReport.orders?.filter(order => 
      order?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.orderDate?.includes(searchTerm)
    )
  }, [salesReport.orders, searchTerm])


  useEffect(()=>{
    const generateSalesReport = async() => {
       try{
        const {data}=await axiosAdminInstance.post(`/sales-report/${dateRange}`)
        setSalesReport(data?.salesReport)
        setChartData(data.chartData)

       }catch(err){
          toast.error(err?.response?.data?.message)
       }
    }
    if(dateRange != 'custom'){
        generateSalesReport()
    }
    
  },[dateRange])




const handleCustomSalesReport=async()=>{
   if(dateRange == 'custom' && startDate && endDate  && (startDate < endDate)){
    const {data}=await axiosAdminInstance.post(`/sales-report/${dateRange}`,{startDate,endDate})
    setSalesReport(data?.salesReport)
    setChartData(data?.chartData)
    setDateRange('custom')
   }else{
    return toast.error("Enter Valid Starting and Ending Date")
   }
}

 

  return (
    <CCard className="mb-4">
      <CCardBody>
      <div className="d-flex align-items-center mb-3">
     
     <CRow>
               <CCol md={4}>
               <CFormSelect 
                   value={dateRange}
                   onChange={(e) =>{
                     setDateRange(e.target.value)
                   }}
                   style={{width:'fit-content'}}
                 >
                   <option value="daily">Daily</option>
                   <option value="weekly">Weekly</option>
                   <option value="monthly">Monthly</option>
                   <option value="yearly">Yearly</option>
                   <option value="custom">Custom Range</option>
                 </CFormSelect>
               </CCol>
               {dateRange === 'custom' && (
                 <>
                   <CCol md={4}>
                     <CFormInput 
                       type="date"
                       value={startDate}
                       onChange={(e) => setStartDate(e.target.value)}
                       placeholder="Start Date"
                     />
                   </CCol>
                   <CCol >
                     <CFormInput 
                       type="date"
                       value={endDate}
                       onChange={(e) => setEndDate(e.target.value)}
                       placeholder="End Date"
                     />
                   </CCol>
                  <CCol md={4} className='mt-3'>
                  <CButton color='primary' onClick={handleCustomSalesReport}>
                    Get Custom Sales Report
                   </CButton>
                  </CCol>
                 </>
               )}
             </CRow>
       
     </div>
        <CRow className="mb-4">
          <CCol sm={6} md={3}>
            <div className="border p-3 rounded text-center">
              <h6 className="text-medium-emphasis">Total Revenue</h6>
              <h4 className="text-primary">₹{salesReport.totalRevenue.toFixed(2)}</h4>
            </div>
          </CCol>
          <CCol sm={6} md={3}>
            <div className="border p-3 rounded text-center">
              <h6 className="text-medium-emphasis">Total Discount</h6>
              <h4 className="text-danger">₹{salesReport.totalDiscount?.toFixed(2)}</h4>
            </div>
          </CCol>
          <CCol sm={6} md={3}>
            <div className="border p-3 rounded text-center">
              <h6 className="text-medium-emphasis">Total Sales</h6>
              <h4 className="text-success">{salesReport.totalSales}</h4>
            </div>
          </CCol>
          <CCol sm={6} md={3}>
            <div className="border p-3 rounded text-center">
              <h6 className="text-medium-emphasis">Items Sold</h6>
              <h4 className="text-info">{salesReport.itemsSold}</h4>
            </div>
          </CCol>
        </CRow>

       
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <h5>Orders</h5>
          <div className="d-flex">
            <CFormInput 
              placeholder="Search orders ID" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="me-2"
              style={{ width: '200px' }}
            />
            <CButton color="primary" variant="outline">
              <CIcon icon={cilSearch} />
            </CButton>
          </div>
        </div>

        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Order ID</CTableHeaderCell>
              <CTableHeaderCell>Order Date</CTableHeaderCell>
              <CTableHeaderCell>Total Amount</CTableHeaderCell>
              <CTableHeaderCell>Coupon</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredOrders?.map((order) => (
              <CTableRow key={order.id}>
                <CTableDataCell>{order._id}</CTableDataCell>
                <CTableDataCell>
                    {new Date(order.orderDate).toLocaleDateString()}
                 </CTableDataCell>
                <CTableDataCell>₹{order.totalAmount.toFixed(2)}</CTableDataCell>
                <CTableDataCell>
                  {order.coupon ? (
                    <CBadge color="success">Coupon Applied</CBadge>
                  ) : (
                    <CBadge color="secondary">No Coupon</CBadge>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <PDFDownloadLink
        document={<SalesPDFDocument salesReport={salesReport} />}
        fileName={`sales-report-${new Date().toISOString().split('T')[0]}.pdf`}
      >
        {({ blob, url, loading, error }) => (
          <button 
            style={{
              backgroundColor: loading ? '#cccccc' : '#4CAF50',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        )}
      </PDFDownloadLink>
                    <Chart basedOn={dateRange} chartData={chartData}/>
      </CCardBody>
    </CCard>
  )
}

export default SalesReport