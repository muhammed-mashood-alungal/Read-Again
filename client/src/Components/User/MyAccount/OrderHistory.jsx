import React, { useState } from 'react'
import './MyAccount.css'
import { axiosOrderInstance } from '../../../redux/Constants/axiosConstants'
import ReasonPopUp from './ReasonPopUp'
import { toast } from 'react-toastify'
function OrderHistory({ orders }) {
  const [isViewOrder, setIsviewOrder] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState({})
  const [isCancelling, setIsCancelling] = useState(false)
  const [isReturing, setIsReturning] = useState(false)
  const isEligibleForReturn = () => {
    if (selectedOrder.orderStatus == "Delivered") {
      return true
    }
    return false
  }
  const isEligibleForCancel = () => {
    if (selectedOrder.orderStatus == "Penging" ||
      selectedOrder.orderStatus == "Ordered"
    ) {
      return true
    }
    return false
  }
  const itemsCancelOrReturn = (status) => {
    console.log(status)
    if (status == "Delivered") {
      return <button className='return-order-btn'>Request Return</button>
    } else if (status == "Pending" ||
      status == "Ordered") {
      return <button className='cancel-order-btn'>Cancel Item</button>
    } else {
      return null
    }
  }
  const cancelOrder = async (cancellationReason) => {
    try {
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
  const returnOrder = async (returnReason) => {
    try {
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
  return (
    <div>
      {
        isCancelling &&
        <ReasonPopUp isOpen={true}
          onConfirm={cancelOrder}
          type={"Cancel"}
          onClose={() => { setIsCancelling(false) }}
        />
      }
      {
        isReturing &&
        <ReasonPopUp isOpen={true}
          onConfirm={returnOrder}
          type={"Return"}
          onClose={() => { setIsReturning(false) }}
        />
      }
      {
        !isViewOrder ?

          <div>

            <h3 className="tab__header">Your Orders</h3>
            <div className="tab__body">
              <table className="placed__order-table">
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
                        <td>{index + 1}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>{order.orderStatus}</td>
                        <td>{order.totalAmount}</td>
                        <td><span onClick={() => {
                          setSelectedOrder(order)
                          setIsviewOrder(true)
                        }} className="link-button">View</span></td>
                      </tr>
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
          :
          <div className="order-details-container">
            <div className="order-header">
              <h2>Order Details</h2>
              <h3
                className="order-status"
              //  style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
              >
                {selectedOrder.orderStatus}
              </h3>

            </div>

            <div className="order-info">
              <div className="order-meta">
                <div>
                  <label>Order Number</label>
                  <p>{selectedOrder._id}</p>
                </div>
                <div>
                  <label>Order Date</label>
                  <p>{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                </div>
              </div>

              <table className="order-items">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.bookId?._id}>
                      <td>{item?.bookId.title}</td>
                      <td>{item?.quantity}</td>
                      <td>${(item?.quantity * item?.bookId?.formats?.physical?.price)}</td>
                      <td>{itemsCancelOrReturn(item.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="order-total">
                <strong>Total</strong>
                <span>${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
              <div className="shipping-info">
                <h3>Shipping Information</h3>
                {/* <p>{selectedOrder}</p> */}
                <p>{selectedOrder.shippingAddress}</p>
              </div>
              <div>
                {
                  isEligibleForReturn() && <button className='return-order-btn'
                    onClick={() => { setIsReturning(true) }}>Request Return </button>
                }
                <br />
                {
                  isEligibleForCancel() && <button className='cancel-order-btn'
                    onClick={() => { setIsCancelling(true) }}>Cancel Order</button>
                }

              </div>
            </div>
          </div>
      }
    </div>

  )
}

export default OrderHistory