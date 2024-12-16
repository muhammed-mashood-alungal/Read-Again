import React, { useState } from 'react'
import './MyAccount.css'
import { axiosOrderInstance } from '../../../redux/Constants/axiosConstants'
import ReasonPopUp from '../../ReasonPopUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import { 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell,
  CButton,
  CContainer,
  CRow,
  CCol,
  CBadge
} from '@coreui/react';
import { cilArrowLeft } from '@coreui/icons';
import CIcon from '@coreui/icons-react';


function OrderHistory({ orders ,  setCurrentOrderPage , currentOrderPage ,totalPages }) {
  const [isViewOrder, setIsviewOrder] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState({})
  const [isCancelling, setIsCancelling] = useState(false)
  const [isReturing, setIsReturning] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const isEligibleForReturn = () => {
    if (selectedOrder.orderStatus == "Delivered" && !selectedOrder.isRejectedOne) {
      return true
    }
    return false
  }
  const isEligibleForCancel = () => {
    if (selectedOrder.orderStatus == "Pending" ||
      selectedOrder.orderStatus == "Ordered"
    ) {
      return true
    }

    return false
  }
  const itemsCancelOrReturn = (status, itemId) => {

    if (status == "Delivered" && !selectedOrder.isRejectedOnce) {
      return <td><button className='return-order-btn'
        onClick={() => {
          setSelectedItemId(itemId)
          setIsReturning(true)
        }}
      >Request Return</button>
      </td>
    } else if (status == "Pending" ||
      status == "Ordered") {
      return <td>
        <button className='cancel-order-btn'
          onClick={() => {
            setSelectedItemId(itemId)
            setIsCancelling(true)
          }}>Cancel Item</button>
      </td>
    } else {
      return false
    }
  }
  const cancelOrder = async (cancellationReason) => {
    try {
      if (selectedItemId) {
        return cancelOrderItem(cancellationReason)
      }
      console.log(selectedOrder._id)
      await axiosOrderInstance.put(`/${selectedOrder._id}/cancel-order`, { cancellationReason })
      const newOrderData = { ...selectedOrder }
      newOrderData.stockStatus = "Canceled"
      newOrderData.items = newOrderData.items.map((item) => {
        item.status = "Cancelled"
        return item
      })
      setSelectedOrder({ ...selectedOrder, orderStatus: "Canceled" })

      toast.success("Your Order cancelled")
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message)
    }
  }

  const cancelOrderItem = async (cancellationReason) => {
    try {
      console.log(cancellationReason, selectedItemId)
      const { data } = await axiosOrderInstance.put(`/${selectedOrder._id}/items/${selectedItemId}/cancel`, { cancellationReason })
      const newOrderData = { ...selectedOrder }
      console.log(newOrderData.items)
      newOrderData.items = newOrderData.items?.map((item) => {
        return item.bookId._id == selectedItemId ? { ...item, status: "Canceled", reason: cancellationReason } : item
      })
      if (data.isAllItemsCancelled) {
        newOrderData.orderStatus = "Canceled"
        newOrderData.cancellationReason = "All Items Cancelled"
      }
      setSelectedOrder(newOrderData)
      setSelectedItemId(null)
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message)
    }
  }

  const returnOrder = async (returnReason) => {
    try {
      if (selectedItemId) {
        return requestReturnItem(returnReason)
      }
      await axiosOrderInstance.put(`/${selectedOrder._id}/request-return-order`, { returnReason })
      const newOrderData = { ...selectedOrder }
      newOrderData.stockStatus = "Return Requested"
      newOrderData.items = newOrderData.items.map((item) => {
        item.status = "Return Requested"
        return item
      })
      setSelectedOrder({ ...selectedOrder, orderStatus: "Return Requested" })
      toast.success("Your Request For Returning This order Is Sent Successfully")
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message)
    }
  }

  const requestReturnItem = async (returnReason) => {
    try {
      console.log(returnReason, selectedItemId)
      const { data } = await axiosOrderInstance.put(`/${selectedOrder._id}/items/${selectedItemId}/return`, { returnReason })
      const newOrderData = { ...selectedOrder }
      console.log(newOrderData.items)
      newOrderData.items = newOrderData.items?.map((item) => {
        return item.bookId._id == selectedItemId ? { ...item, status: "Return Requested", reason: returnReason } : item
      })
      setSelectedOrder(newOrderData)
      setSelectedItemId(null)
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message)
    }
  }

  
return (
  <CContainer fluid className="p-3">
  {isCancelling && (
    <ReasonPopUp 
      isOpen={true}
      onConfirm={cancelOrder}
      type="Cancel"
      onClose={() => setIsCancelling(false)}
    />
  )}
  {isReturing && (
    <ReasonPopUp 
      isOpen={true}
      onConfirm={returnOrder}
      type="Return"
      onClose={() => setIsReturning(false)}
    />
  )}

  {!isViewOrder ? (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-white d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Your Orders</h3>
      </CCardHeader>
      <CCardBody>
        {orders.length === 0 ? (
          <CRow className="justify-content-center">
            <CCol md={6} className="text-center">
              <p className="text-muted">You Have Not Ordered Anything Yet..!</p>
            </CCol>
          </CRow>
        ) : (
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Orders</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Totals</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {orders.map((order, index) => (
                <CTableRow key={order._id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="info">{order.orderStatus}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>₹{order.totalAmount}</CTableDataCell>
                  <CTableDataCell>
                    <CButton 
                      color="primary" 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsviewOrder(true);
                      }}
                    >
                      View
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
        <div className="pagination">
               <button onClick={() => setCurrentOrderPage(currentOrderPage - 1)} disabled={currentOrderPage === 1}>
                 Previous
               </button>
               <span style={{color:'black'}}> Page {currentOrderPage} of {totalPages} </span>
               <button onClick={() => setCurrentOrderPage(currentOrderPage + 1)} disabled={currentOrderPage === totalPages}>
                 Next
               </button>
             </div>
      </CCardBody>
    </CCard>
  ) : (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-white d-flex align-items-center">
        <CButton 
          color="light" 
          className="me-3" 
          onClick={() => setIsviewOrder(false)}
        >
          <CIcon icon={cilArrowLeft} />
        </CButton>
        <div className="d-flex justify-content-between w-100 align-items-center">
          <h2 className="mb-0">Order Details</h2>
          <CBadge color="info">{selectedOrder.orderStatus}</CBadge>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-4">
          <CCol md={6}>
            <strong>Order Number</strong>
            <p>{selectedOrder._id}</p>
          </CCol>
          <CCol md={6} className="text-end">
            <strong>Order Date</strong>
            <p>{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
          </CCol>
        </CRow>

        <CTable responsive hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Product</CTableHeaderCell>
              <CTableHeaderCell>Quantity</CTableHeaderCell>
              <CTableHeaderCell>Price</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {selectedOrder.items.map((item) => (
              <CTableRow key={item.bookId?._id}>
                <CTableDataCell>{item?.bookId.title}</CTableDataCell>
                <CTableDataCell>{item?.quantity}</CTableDataCell>
                <CTableDataCell>₹{(item?.quantity * item.unitPrice)}</CTableDataCell>
                {itemsCancelOrReturn(item.status,item?.bookId?._id)}
                {item.status === "Canceled" && (
                  <CTableDataCell color='danger'>
                    
                    Canceled: {item.reason}</CTableDataCell>
                 
                  )}
                   {item.status === "Return Requested" && (
                    <CTableDataCell color='warning'>
                      Return Requested: {item.reason}
                      </CTableDataCell>
                 
                  )}
                  {item.status === "Returned" && (
                    <CTableDataCell color="success">
                      Returned: {item.reason}
                    </CTableDataCell>
                  )}
                  {item.status === "Returned" && (
                    <CTableDataCell color="success">
                      Returned: {item.reason}
                    </CTableDataCell>
                  )}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <CRow className="mt-4">
          <CCol md={6}>
            <h5>Shipping Information</h5>
            <p>{selectedOrder.shippingAddress}</p>
          </CCol>
          <CCol md={6}>
          <CCol  className="text-end">
            <h6>Total Amount</h6>
            <p className="h4 text-primary">₹{selectedOrder.totalAmount.toFixed(2)}</p>
          </CCol>
          {
            selectedOrder.coupon &&  <CCol  className="text-end">
            <h6>Discounted Amount</h6>
            <p className="h4 text-primary">₹{(selectedOrder.totalAmount.toFixed(2) * (selectedOrder?.coupon?.discountValue/100))}</p>
          </CCol>
          }
          <hr />
         
          <CCol className="text-end">
            <h5>Payable Amount</h5>
            <p className="h4 text-primary">₹{selectedOrder.payableAmount?.toFixed()}</p>
          </CCol>
          </CCol>
         
        </CRow>

        <CRow className="mt-4">
          <CCol>
            <h5>Payment Status</h5>
            <CBadge color="info">{selectedOrder.paymentStatus}</CBadge>
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <CCol>
            {isEligibleForReturn() && (
              <CButton 
                color="danger" 
                className="me-2"
                onClick={() => setIsReturning(true)}
              >
                Request Return
              </CButton>
            )}

            {isEligibleForCancel() && (
              <CButton 
                color="danger" 
                onClick={() => setIsCancelling(true)}
              >
                Cancel Order
              </CButton>
            )}

            {selectedOrder.isRejectedOnce && (
              <p className="text-danger mt-2">
                You can't Request Return Again, Because Your Request is Already Rejected By Admin
              </p>
            )}
          </CCol>
        </CRow>
        <hr />
        {selectedOrder.cancellationReason && (
          <CRow className="mt-4">
            <CCol>
              <h5>Cancellation Reason</h5>
              <p>{selectedOrder.cancellationReason}</p>
            </CCol>
          </CRow>
        )}

        {selectedOrder.returnReason && (
          <CRow className="mt-4">
            <CCol>
              <h4>Return Reason</h4>
              <p>{selectedOrder.returnReason}</p>
            </CCol>
          </CRow>
        )}
      </CCardBody>
    </CCard>
  )}
</CContainer>
);
}

export default OrderHistory