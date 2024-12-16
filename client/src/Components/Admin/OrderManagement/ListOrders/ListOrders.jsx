import React, { useEffect, useState } from 'react'
import OrderDetails from '../OrderDetails/OrderDetails';
import { Col, Container, Row } from 'reactstrap';
import { axiosOrderInstance } from '../../../../redux/Constants/axiosConstants';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../ConfirmationModal/ConfirmationModal';
import {  CCard, 
  CCardBody, 
  CCardHeader, 
  CCol, 
  CFormCheck, 
  CRow ,
  CTable ,
  CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowThickFromRight } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
function ListOrders() {
  const [orders, setOrders] = useState([])
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [orderStatus, setOrderStatus] = useState('all')
  const [paymentStatus, setPaymentStatus] = useState('all')
  const limit = 10
  const navigate = useNavigate()
  useEffect(() => {
    async function fetchAllOrders() {
      try {
        const { data } = await axiosOrderInstance.get(`/?page=${currentPage}&limit=${limit}&orderStatus=${orderStatus}&paymentStatus=${paymentStatus}`)
        setOrders(data.orders)
        let pages = Math.ceil(data?.totalOrders / limit)
        setTotalPages(pages)
      } catch (err) {
        console.log(err)
        toast.error(err?.response?.data?.message)
      }
    }
    fetchAllOrders()
  }, [currentPage,orderStatus,paymentStatus])
  return (
    <Container className='content'>

      <Row className="category-management">

        <Col>
          <div className="row p-3">
            <div className="col-12 grid-margin">
              <div className="card category-table">
                <div className="card-body">
                  <h4 className="table-title">Orders</h4>
                  <form className="nav-link mt-2 mt-md-0 d-lg-flex search">
                  </form>
                  <br />
                  <CRow>
                    <CCol md={6}>
                      <CCard className="mb-4">
                        <CCardHeader>
                          <strong>Order Status</strong>
                        </CCardHeader>
                        <CCardBody>
                          <CRow>
                          <CCol>
                          <div className="d-grid gap-2">
                            <CFormCheck
                              type="radio"
                              name="orderStatus"
                              id="orderStatusAll"
                              label="All"
                              checked={orderStatus === 'all'}
                              onChange={() => setOrderStatus('all')}
                            />
                            <CFormCheck
                              type="radio"
                              name="orderStatus"
                              id="orderStatusOrdered"
                              label="Ordered"
                              checked={orderStatus === 'ordered'}
                              onChange={() => setOrderStatus('ordered')}
                            />
                            <CFormCheck
                              type="radio"
                              name="orderStatus"
                              id="orderStatusShipped"
                              label="Shipped"
                              checked={orderStatus === 'shipped'}
                              onChange={() => setOrderStatus('shipped')}
                            />
                            <CFormCheck
                              type="radio"
                              name="orderStatus"
                              id="orderStatusDelivered"
                              label="Delivered"
                              checked={orderStatus === 'delivered'}
                              onChange={() => setOrderStatus('delivered')}
                            />
                          </div>
                          </CCol>
                          <CCol>
                          <div className="d-grid gap-2">
                            <CFormCheck
                              type="radio"
                              name="orderStatus"
                              id="orderStatusOrdered"
                              label="Canceled"
                              checked={orderStatus === 'canceled'}
                              onChange={() => setOrderStatus('canceled')}
                            />
                            <CFormCheck
                              type="radio"
                              name="orderStatus"
                              id="orderStatusShipped"
                              label="Returned"
                              checked={orderStatus === 'returned'}
                              onChange={() => setOrderStatus('returned')}
                            />
                            <CFormCheck
                              type="radio"
                              name="orderStatus"
                              id="orderStatusDelivered"
                              label="Return Requested"
                              checked={orderStatus === 'return requested'}
                              onChange={() => setOrderStatus('return requested')}
                            />
                            <CFormCheck
                              type="radio"
                              name="orderStatus"
                              id="orderStatusDelivered"
                              label="Return Rejected"
                              checked={orderStatus === 'return rejected'}
                              onChange={() => setOrderStatus('return rejected')}
                            />
                          </div>
                          </CCol>
                          </CRow>
                        </CCardBody>
                      </CCard>
                    </CCol>

                    <CCol md={6}>
                      <CCard className="mb-4">
                        <CCardHeader>
                          <strong>Payment Status</strong>
                        </CCardHeader>
                        <CCardBody>
                          <div className="d-grid gap-2">
                            <CFormCheck
                              type="radio"
                              name="paymentStatus"
                              id="paymentStatusAll"
                              label="All"
                              checked={paymentStatus === 'all'}
                              onChange={() => setPaymentStatus('all')}
                            />
                            <CFormCheck
                              type="radio"
                              name="paymentStatus"
                              id="paymentStatusSuccess"
                              label="Success"
                              checked={paymentStatus === 'success'}
                              onChange={() => setPaymentStatus('success')}
                            />
                            <CFormCheck
                              type="radio"
                              name="paymentStatus"
                              id="paymentStatusPending"
                              label="Pending"
                              checked={paymentStatus === 'pending'}
                              onChange={() => setPaymentStatus('pending')}
                            />
                            <CFormCheck
                              type="radio"
                              name="paymentStatus"
                              id="paymentStatusFailed"
                              label="Refunded"
                              checked={paymentStatus === 'refunded'}
                              onChange={() => setPaymentStatus('refunded')}
                            />
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                  <div className="table-responsive">
                    <CTable striped>
                      <thead>
                        <tr>
                          <th>Orders</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Totals</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          orders.map((order, index) => {
                            return <tr>

                              <td>{((currentPage - 1) * 10) + index + 1}</td>
                              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                              <td>{order.orderStatus}</td>
                              <td>{order.totalAmount}</td>
                              <td>
                                <CButton onClick={() => {
                                  // setSelectedOrder(order)
                                  // setShowOrderDetails(true)
                                  navigate('/admin/orders/view', { state: { selectedOrder: order } })
                                }}
                                  color="info" variant="outline"
                                >View</CButton>
                              </td>
                            </tr>
                          })
                        }
                      </tbody>
                    </CTable>
                  </div>
                  <div className="pagination">
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                      Previous
                    </button>
                    <span> Page {currentPage} of {totalPages} </span>
                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>

      </Row>
    </Container>
  );

}

export default ListOrders