import React, { useState } from 'react'
import './OrderDetails.css'
import { axiosOrderInstance } from '../../../../redux/Constants/axiosConstants'
import { toast } from 'react-toastify'
import ReasonPopUp from '../../../ReasonPopUp'
import { 
    CCard, 
    CCardHeader, 
    CCardBody, 
    CTable, 
    CTableHead, 
    CTableRow, 
    CTableHeaderCell, 
    CTableBody, 
    CTableDataCell,
    CButton,
    CBadge,
    CRow,
    CCol,
    CContainer
  } from '@coreui/react';
import { useLocation, useNavigate } from 'react-router-dom'
import { cilArrowThickFromRight } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

function OrderDetails({  }) {
    const location = useLocation()
    const selectedOrder = location.state.selectedOrder
    const [order, setOrder] = useState(selectedOrder ? selectedOrder : {})
    const [isCancelling, setIsCancelling] = useState(false)
    const [selectedItemId, setSelectedItemId] = useState(null)
    const navigate = useNavigate()
    const isEligibleForCancel = () => {
        if (order.orderStatus == "Pending" ||
            order.orderStatus == "Ordered"
        ) {
            return true
        }
        return false
    }
    const itemsCancelOrReturn = (status, itemId) => {
        console.log(status)
        if (status == "Pending" ||
            status == "Ordered") {
            return <td><button className='cancel-order-btn'
                onClick={() => {
                    setIsCancelling(true)
                    setSelectedItemId(itemId)
                }}>Cancel Item</button>
            </td>
        } else if (status == "Return Requested") {
            return <td>
                <button className='reject-btn'
                    onClick={() => {
                        rejectItemReturn(itemId)
                    }}>Reject Request</button>
                <button className='approve-btn'
                    onClick={() => {
                        approveItemReturn(itemId)
                    }}>Approve Item</button>
            </td>
        } else {
            return null
        }
    }

    const isReturnRequested = () => {
        console.log(order.orderStatus)
        if (order.orderStatus == "Return Requested") {
            return <div>
                <button className='reject-btn' onClick={rejectRequest}>Reject </button>
                <button className='approve-btn' onClick={approveRequest}>Approve</button>
            </div>

        } else {
            return null
        }
    }
    const approveRequest = async () => {
        try {
            await axiosOrderInstance.put(`/${order._id}/approve-return-request`)
            console.log({ ...order, orderStatus: "Returned" })
            setOrder({ ...order, orderStatus: "Returned" })
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message)
        }
    }

    const rejectRequest = async () => {
        try {
            await axiosOrderInstance.put(`/${order._id}/reject-return-request`)
            console.log({ ...order, orderStatus: "Delivered" })
            setOrder({ ...order, orderStatus: "Delivered" })
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message)
        }
    }
    const showChangeOrderChange = () => {
        const notChangableStatus = ["Returned", "Canceled", "Return Requested"]
        if (!notChangableStatus.includes(order.orderStatus)) {
            return <div className='change-status-div'>
                <select name="" id=""
                    className='form-control'
                    onChange={handleStatusChange}
                    value={order.orderStatus}
                >
                    <option value="Ordered">Ordered</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                </select>
            </div>
        }
    }
    const handleStatusChange = async (e) => {
        try {
            const value = e.target.value
            await axiosOrderInstance.put(`/${order._id}/change-status/${value}`)
            setOrder({ ...order, orderStatus: value })
            toast.success(`Order ${value}`)
        } catch (err) {

        }


    }
    const cancelOrder = async (cancellationReason) => {
        try {
            if (selectedItemId) {
                return cancelOrderItem(cancellationReason)
            }
            await axiosOrderInstance.put(`/${order._id}/cancel-order`, { cancellationReason })
            const newOrderData = { ...selectedOrder }
            newOrderData.stockStatus = "Canceled"
            newOrderData.items = newOrderData.items.map((item) => {
                item.status = "Cancelled"
                return item
            })
            setOrder({ ...selectedOrder, orderStatus: "Canceled" })
            toast.success("Order Cancelled")
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message)
        }
    }
    const cancelOrderItem = async (cancellationReason) => {
        try {
            console.log(cancellationReason, selectedItemId)
            const { data } = await axiosOrderInstance.put(`/${selectedOrder._id}/items/${selectedItemId}/cancel`, { cancellationReason })
            const newOrderData = { ...order }
            console.log(newOrderData.items)
            newOrderData.items = newOrderData.items?.map((item) => {
                return item.bookId._id == selectedItemId ? { ...item, status: "Canceled", reason: cancellationReason } : item
            })
            if (data.isAllItemsCancelled) {
                newOrderData.orderStatus = "Canceled"
                newOrderData.cancellationReason = "All Items Cancelled"
            }
            setOrder(newOrderData)
            toast.success("Item cancelled From Order")
            setSelectedItemId(null)
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message)
        }
    }
    const approveItemReturn = async (itemId) => {
        try {
            const {data}=await axiosOrderInstance.put(`/${order._id}/items/${itemId}/approve-return`)
            const orderData = { ...order }

            orderData.items = orderData.items.map((item) => {
                return item.bookId._id == itemId ? { ...item, status: "Returned" } : item
            })
            toast.success("Item Return Approved")
            if(data.isAllItemsReturned){
                orderData.orderStatus="Returned"
                orderData.returnReason ="All Items Returned"
            }
            
            setOrder(orderData)
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message)
        }
    }
    const rejectItemReturn = async (itemId) => {
        try {
            await axiosOrderInstance.put(`/${order._id}/items/${itemId}/reject-return`)
            const orderData = { ...order }
            orderData.items = orderData.items.map((item) => {
                return item.bookId._id == itemId ? { ...item, status: "Rejected" } : item
            })
            toast.success("Item Return Rejected")
            setOrder(orderData)
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message)
        }
    }
    return (
      <CContainer className='mt-5'>
         <CButton onClick={()=>{navigate('/admin/orders')}}>
                <CIcon icon={cilArrowThickFromRight} /> Go Back
            </CButton>
    <CCard className="order-details-container">
      {isCancelling && (
        <ReasonPopUp 
          isOpen={true}
          onConfirm={cancelOrder}
          type={"Cancel"}
          onClose={() => { setIsCancelling(false) }}
        />
      )}

      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h2 className="mb-0">Order Details</h2>
        <CBadge color="info">{order.orderStatus}</CBadge>
      </CCardHeader>

      <CCardBody>
        <CRow className="mb-4">
          <CCol md="6">
            <div className=" d-flex  justify-content-between">
              <div  >
                <strong>Order Number</strong>
                <p>{order._id}</p>
              </div>
              <div>
                <strong>Order Date</strong>
                <p>{new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CCol>
          <CCol>
          <div>
              {showChangeOrderChange()} 
              </div>
          </CCol>
          
        </CRow>

        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Product</CTableHeaderCell>
              <CTableHeaderCell>Quantity</CTableHeaderCell>
              <CTableHeaderCell>Price</CTableHeaderCell>
              <CTableHeaderCell>Options</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {order.items.map((item) => (
              <CTableRow key={item.bookId?._id}>
                <CTableDataCell>{item?.bookId.title}</CTableDataCell>
                <CTableDataCell>{item?.quantity}</CTableDataCell>
                <CTableDataCell>₹{(item?.quantity * item?.bookId?.formats?.physical?.price).toFixed(2)}</CTableDataCell>
                {itemsCancelOrReturn(item.status, item.bookId._id)}
                {item.status === "Canceled" && (
                  <CTableDataCell className='text-danger'>
                    Item canceled <br /> 
                    Reason: {item.reason}
                  </CTableDataCell>
                )}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <CRow className="mb-4">
           <CCol md={6}>
                    <CCol  className="text-end">
                      <h6>Total Amount</h6>
                      <p className="h4 text-primary">₹{selectedOrder.totalAmount.toFixed(2)}</p>
                    </CCol>
                    {
                      selectedOrder.coupon &&  <CCol  className="text-end">
                      <h6>Discounted Amount</h6>
                      <p className="h4 text-primary">₹{Math.round((selectedOrder.totalAmount * (selectedOrder?.coupon?.discountValue / 100)) * 100) / 100}</p>
                    </CCol>
                    }
                    <hr />
                   
                    <CCol className="text-end">
                      <h5>Payable Amount</h5>
                      <p className="h4 text-primary">₹{selectedOrder.payableAmount?.toFixed()}</p>
                     
                    </CCol>
                    </CCol>
        </CRow>

        <CRow>
          <CCol md="4">
            <CCard className="mb-3">
              <CCardHeader>User Information</CCardHeader>
              <CCardBody>
                <p>{order.userId.username}</p>
                <p>{order.userId.email}</p>
                <p>{order.userId.phone || "Phone Not Added"}</p>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md="4">
            <CCard className="mb-3">
              <CCardHeader>Payment Information</CCardHeader>
              <CCardBody>
                <CBadge color="info">{order.paymentStatus}</CBadge>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md="4">
            <CCard className="mb-3">
              <CCardHeader>Shipping Information</CCardHeader>
              <CCardBody>
                <p>{order.shippingAddress}</p>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CRow className="mt-3">
          <CCol>
            {isEligibleForCancel() && (
              <CButton 
                color="danger" 
                onClick={() => { setIsCancelling(true) }}
              >
                Cancel Order
              </CButton>
            )}

            {order.cancellationReason && (
              <div className="mt-3">
                <h4>Cancel Reason</h4>
                <p>{order.cancellationReason}</p>
              </div>
            )}

            {order.returnReason && (
              <div className="mt-3">
                <h4>Return Reason</h4>
                <p>{order.returnReason}</p>
              </div>
            )}

            {isReturnRequested()}
          
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    </CContainer>
  );
}

export default OrderDetails