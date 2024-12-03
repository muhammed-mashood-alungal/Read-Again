import React, { useEffect, useState } from 'react'
import OrderDetails from '../OrderDetails/OrderDetails';
import { Col, Container, Row } from 'reactstrap';
import { axiosOrderInstance } from '../../../../redux/Constants/axiosConstants';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../ConfirmationModal/ConfirmationModal';
function ListOrders() {
    const [orders,setOrders]=useState([])
    const [showOrderDetails , setShowOrderDetails] = useState(false)
    const [currentPage , setCurrentPage]=useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedOrder,setSelectedOrder]=useState({})
    const [showModal,setShowModal]=useState(false)
    const limit=10
    useEffect(()=>{
     async function fetchAllOrders(){
       try{
       const {data} = await axiosOrderInstance.get(`/?page=${currentPage}&limit=${limit}`)
       setOrders(data.orders)
       let pages= Math.ceil(data?.totalUsers/limit)
       setTotalPages(pages)
       }catch(err){
         console.log(err)
         toast.error(err?.response?.data?.message)
       }
     }
     fetchAllOrders()
    },[currentPage])
    return (
        <Container className='content'>

        <Row className="category-management">
            {
              !showOrderDetails ?  

            
          <Col md={8}>
          <h4 className="title">Order Management</h4>
    
          <div className="row p-3">
            <div className="col-12 grid-margin">
              <div className="card category-table">
                <div className="card-body">
                  <h4 className="table-title">Orders</h4>
                  <form className="nav-link mt-2 mt-md-0 d-lg-flex search">
                      <input
                        type="text"
                        className="form-control mt-1"
                        placeholder="Search Users"
                       // onChange={handleUserSearch}
                      />
                    
                    </form>
                    <br />
                  <div className="table-responsive">
                    
                    <table className="table">
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
                   
                        <td>{((currentPage-1)*10)+index+1}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>{order.orderStatus}</td>
                        <td>{order.totalAmount}</td>
                        <td><span onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderDetails(true)
                        }} className="link-button">View</span></td>
                      </tr>
                    })
                  }
                </tbody>
                    </table>
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
         <p onClick={()=>{setShowOrderDetails(false)}}>Back</p>
         <OrderDetails selectedOrder={selectedOrder}/>
         </>  
          }
        </Row>
        </Container>
      );
  
}

export default ListOrders