import React, { useState } from 'react'
import './MyAccount.css'
import { axiosOrderInstance } from '../../../redux/Constants/axiosConstants'
import ReasonPopUp from '../../ReasonPopUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
function OrderHistory({ orders }) {
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
      // if(data.isAllItemsCancelled){
      //  newOrderData.orderStatus = "Return Requested"
      //  newOrderData.returnReason = "All Return Requested"
      // }
      setSelectedOrder(newOrderData)
      setSelectedItemId(null)
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

          <div className='p-2'>

            <h3 className="tab__header">Your Orders</h3>
            {
              orders.length == 0 ? <h2 className='empty-msg'>You Have Not ordered Anything Yet..!</h2>
                : <div className="tab__body">
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
                            <td>₹{order.totalAmount}</td>
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

            }
          </div>

          :
          <div className="my-order-details-container">
            <div className="order-header">
              <FontAwesomeIcon icon={faArrowLeft} onClick={() => {
                setIsviewOrder(false)
              }} />
              <h2>Order Details</h2>
              <h3
                className="my-order-status"
              //  style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
              >
                {selectedOrder.orderStatus}
              </h3>

            </div>

            <div className="my-order-info">
              <div className="my-order-meta">
                <div>
                  <label>Order Number</label>
                  <p>{selectedOrder._id}</p>
                </div>
                <div>
                  <label>Order Date</label>
                  <p>{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                </div>
              </div>

              <table className="my-order-items">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={item.bookId?._id}>
                      <td>{item?.bookId.title}</td>
                      <td>{item?.quantity}</td>
                      <td>₹{(item?.quantity * item?.bookId?.formats?.physical?.price)}</td>
                      {itemsCancelOrReturn(item.status, item.bookId._id)}
                      {
                        item.status == "Canceled" &&
                        <td className='cancel-order-btn'>Item canceled <br /> Reason : {item.reason}</td>
                      }
                      {
                        item.status == "Return Requested" &&
                        <td className='return-item-msg'>Item Requsted For Return <br /> Reason : {item.reason}</td>
                      }
                      {
                        item.status == "Returned" &&
                        <td className='return-item-msg'>Item Returned <br /> Reason : {item.reason}</td>
                      }
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="my-order-total">
                <strong>Total</strong>
                <span>₹{selectedOrder.totalAmount.toFixed(2)}</span>
              </div>

              <div className="my-shipping-info">
                <h3>Shipping Information</h3>
                <p>{selectedOrder.shippingAddress}</p>
              </div>
              <div className="payment-info">
                <hr />
                <table>
                  <tr>
                    <th>Payment Information</th>
                    <tr>{selectedOrder.paymentStatus}</tr>
                  </tr>
                </table>
                {/* <h3></h3>
                <h5>{selectedOrder.paymentStatus}</h5> */}
              </div>
              <div>
                {
                  isEligibleForReturn() && <button className='return-order-btn'
                    onClick={() => { setIsReturning(true) }}>Request Return </button>
                }

                {
                  selectedOrder.isRejectedOnce && <p className='err-msg'>You can't Request Return Again, Becuase Your Requsest is Already Rejected By Admin</p>
                }
                <br />
                {
                  isEligibleForCancel() && <button className='cancel-order-btn'
                    onClick={() => { setIsCancelling(true) }}>Cancel Order</button>
                }
                {
                  selectedOrder.cancellationReason && <div>
                    <hr />
                    <h4>Cancel Reason</h4>
                    <p>{selectedOrder.cancellationReason}</p>
                  </div>
                }
                {
                  selectedOrder.returnReason && <div>
                    <hr />
                    <h4>Return Reason</h4>
                    <p>{selectedOrder.returnReason}</p>
                  </div>
                }


              </div>
            </div>
          </div>
      }
    </div>

  )
}

export default OrderHistory