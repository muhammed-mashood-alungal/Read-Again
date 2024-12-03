import React, { useState } from 'react'
import './OrderDetails.css'
import { axiosOrderInstance } from '../../../../redux/Constants/axiosConstants'
import { toast } from 'react-toastify'
function OrderDetails({ selectedOrder }) {
    const [order,setOrder]=useState(selectedOrder ? selectedOrder : {})
    const [isCancelling, setIsCancelling] = useState(false)
    const [isReturing, setIsReturning] = useState(false)
    const isEligibleForReturn = () => {
        if (order.orderStatus == "Delivered") {
            return true
        }
        return false
    }
    const isEligibleForCancel = () => {
        if (order.orderStatus == "Penging" ||
            order.orderStatus == "Ordered"
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
    
    const isReturnRequested=()=>{
        console.log(order.orderStatus)
        if(order.orderStatus == "Return Requested"){
             return <div>
               <button className='reject-btn'  onClick={rejectRequest}>Reject </button>
               <button className='approve-btn' onClick={approveRequest}>Approve</button>
            </div>
            
        }else{
            return null
        }
    }
    const approveRequest =async ()=>{
    try{
       await axiosOrderInstance.put(`/${order._id}/approve-request`)
       console.log({...order,orderStatus:"Returned"})
       setOrder({...order,orderStatus:"Returned"})
    }catch(err){
       console.log(err)
       toast.error(err?.response?.data?.message)
    }
    }

    const rejectRequest =async ()=>{
        try{
           await axiosOrderInstance.put(`/${order._id}/reject-request`)
           console.log({...order,orderStatus:"Return Rejected"})
           setOrder({...order,orderStatus:"Return Rejected"})
        }catch(err){
           console.log(err)
           toast.error(err?.response?.data?.message)
        }
        }
    return (

        <div>
            <div className="order-details-container">
                <div className="order-header">
                    <h2>Order Details</h2>
                    <h3
                        className="order-status"
                    //  style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                    >
                        {order.orderStatus}
                    </h3>

                </div>

                <div className="order-info">
                    <div className="order-meta">
                        <div>
                            <label>Order Number</label>
                            <p>{order._id}</p>
                        </div>
                        <div>
                            <label>Order Date</label>
                            <p>{new Date(order.orderDate).toLocaleDateString()}</p>
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
                            {order.items.map((item) => (
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
                        <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="shipping-info">
                        <h3>Shipping Information</h3>
                        {/* <p>{selectedOrder}</p> */}
                        <p>{order.shippingAddress}</p>
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
                        {
                            order.cancellationReason && <div>
                                <h2>Cancel Reason</h2>
                                <p>{order.cancellationReason}</p>
                            </div>
                        }
                        {
                            order.returnReason && <div>
                                <h2>Return Reason</h2>
                                <p>{order.returnReason}</p>
                            </div>
                        }
                        <p>{order.orderStatus}</p>
                        {
                            isReturnRequested()
                            
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails