import React, { useState } from 'react'
import './OrderDetails.css'
import { axiosOrderInstance } from '../../../../redux/Constants/axiosConstants'
import { toast } from 'react-toastify'
import ReasonPopUp from '../../../User/MyAccount/ReasonPopUp'
function OrderDetails({ selectedOrder }) {
    const [order, setOrder] = useState(selectedOrder ? selectedOrder : {})
    const [isCancelling, setIsCancelling] = useState(false)
    const [selectedItemId, setSelectedItemId] = useState(null)
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
            setSelectedItemId(null)
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message)
        }
    }
    const approveItemReturn = async (itemId) => {
        try {
            console.log("appriving")
            const {data}=await axiosOrderInstance.put(`/${order._id}/items/${itemId}/approve-return`)
            const orderData = { ...order }

            orderData.items = orderData.items.map((item) => {
                return item.bookId._id == itemId ? { ...item, status: "Returned" } : item
            })
            if(data.isAllItemsReturned){
                orderData.orderStatus="Returned"
                orderData.returnReason ="All Items Returned"
            }
            console.log(orderData.items)
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
            setOrder(orderData)
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message)
        }
    }
    return (

        <div>
            <div className="order-details-container">
                {
                    isCancelling &&
                    <ReasonPopUp isOpen={true}
                        onConfirm={cancelOrder}
                        type={"Cancel"}
                        onClose={() => { setIsCancelling(false) }}
                    />
                }
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
                                    {itemsCancelOrReturn(item.status, item.bookId._id)}
                                    {
                                        item.status == "Canceled" &&
                                        <td className='cancel-order-btn'>Item canceled <br /> Reason : {item.reason}</td>
                                    }
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
                        <br />
                        {
                            isEligibleForCancel() && <button className='cancel-order-btn'
                                onClick={() => { setIsCancelling(true) }}>Cancel Order</button>
                        }

                        {
                            order.cancellationReason && <div>
                                <hr />
                                <h4>Cancel Reason</h4>
                                <p>{order.cancellationReason}</p>
                            </div>
                        }
                        {
                            order.returnReason && <div>
                                <hr />
                                <h4>Return Reason</h4>
                                <p>{order.returnReason}</p>
                            </div>
                        }
                        {
                            isReturnRequested()
                        }
                        {
                            showChangeOrderChange()
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails