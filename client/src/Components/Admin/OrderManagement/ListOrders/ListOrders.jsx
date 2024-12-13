import React, { useEffect, useState } from 'react'
import OrderDetails from '../OrderDetails/OrderDetails';
import { Col, Container, Row } from 'reactstrap';
import { axiosOrderInstance } from '../../../../redux/Constants/axiosConstants';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../ConfirmationModal/ConfirmationModal';
import { CButton, CTable } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowThickFromRight } from '@coreui/icons';
function ListOrders() {
  const [orders, setOrders] = useState([])
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState({})
  const [showModal, setShowModal] = useState(false)
  const limit = 10
  useEffect(() => {
    async function fetchAllOrders() {
      try {
        const { data } = await axiosOrderInstance.get(`/?page=${currentPage}&limit=${limit}`)
        setOrders(data.orders)
        let pages = Math.ceil(data?.totalOrders / limit)
        setTotalPages(pages)
      } catch (err) {
        console.log(err)
        toast.error(err?.response?.data?.message)
      }
    }
    fetchAllOrders()
  }, [currentPage])
  return (
    <Container className='content'>

      <Row className="category-management">
        {
          !showOrderDetails ?
            <Col>
              <div className="row p-3">
                <div className="col-12 grid-margin">
                  <div className="card category-table">
                    <div className="card-body">
                      <h4 className="table-title">Orders</h4>
                      <form className="nav-link mt-2 mt-md-0 d-lg-flex search">
                       
                      </form>
                      <br />
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
                                      setSelectedOrder(order)
                                      setShowOrderDetails(true)
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
            :
            <>
            <Col>
               <CButton onClick={() => { setShowOrderDetails(false) }}>
                      <CIcon icon={cilArrowThickFromRight} /> Go Back
                    </CButton>
              <OrderDetails selectedOrder={selectedOrder} />
              </Col>
            </>
        }
      </Row>
    </Container>
  );

}

export default ListOrders