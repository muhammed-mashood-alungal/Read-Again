import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'reactstrap';
import Addresses from '../MyAccount/Addresses';
import { toast } from 'react-toastify';
import { axiosCartInstance, axiosCouponInstance, axiosOrderInstance, axiosRazorpayInstance, axiosUserInstance } from '../../../redux/Constants/axiosConstants';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookImages } from '../../../redux/Constants/imagesDir';
import { useRazorpay } from 'react-razorpay';
import { green } from '@mui/material/colors';

const Checkout = () => {
  const { userId, isLoggedIn } = useSelector(state => state.auth)
  const location = useLocation()
  const cart = location?.state?.cart
  //const [cart,setCart]=useState({})
  const [addresses, setAddresses] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [coupon,setCoupon ]=useState('')
  const [isCouponApplied,setIssCouponApplied]=useState(false)
  const [totalAmount,setTotalAmount] = useState(cart.totalAmount)
  const navigate = useNavigate()
  const [isPlacingOrder,setIsPlacingOrder]=useState(false)
  const {Razorpay} = useRazorpay();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
      toast.error("Login to access Checkout")
    }
  }, [isLoggedIn])

  useEffect(() => {
    const getProfileData = async () => {
      try {
        console.log(userId)
        const response = await axiosUserInstance.get(`/${userId}`)
        setAddresses(response?.data?.userData?.addresses)
      } catch (err) {
        console.log(err)
        if (userId) {
          toast.error(err?.response?.data?.error)
        }

      }
    }
    getProfileData();
  }, [userId])
  const handleMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  }

  const handlePlaceOrder = async() => {
    try {
      setIsPlacingOrder(true)
      cart.items = cart.items.map((item) => {
        
        return {
          ...item,
          bookId: item.productId?._id,
          quantity: item.quantity,
          unitPrice: getPrice(item.productId),
          totalPrice: getPrice(item.productId)* item.quantity
        }
      })
      const orderDetails = {
        items: cart.items,
        shippingCharge: 0,
        totalAmount: totalAmount, 
        orderStatus: "Ordered",
        paymentMethod:paymentMethod,
        coupon:coupon
      }
      const {data} = await axiosOrderInstance.post(`/${userId}/place-order`,orderDetails)
      
      if(paymentMethod === 'Razorpay'){
        try {
          const result = await handleOnlinePayment(orderDetails.totalAmount)
          if (result.success) {
            console.log("orderId :" , data.orderId)
            await axiosOrderInstance.patch(`/${data.orderId}/payment-success`)
            toast.success("Payment Successful");
          } else {
            toast.error("Payment Failed. You can Retry on Order Page")
          }
        } catch (error) {
          console.error(error);
          toast.error("Payment failed, please try again.");
        }
      }
      toast.success("Your Order Placed Successfully.You can Track delivery status in You Order History")
      navigate('/')
      setIsPlacingOrder(false)
      
    
     
    } catch (err) {
      setIsPlacingOrder(false)
      console.log(err)
      toast.error(err?.response?.data?.message)
    }
  }

  const getPrice=(book)=>{
    if(book?.appliedOffer?.isActive && book.formats.physical.offerPrice){
      return book.formats.physical.offerPrice
    }
    return  book.formats.physical.price
  }


  const handleOnlinePayment=(amount)=>{
    return new Promise(async(resolve,reject)=>{
      try{
        const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_ID;
        const {data} = await axiosRazorpayInstance.post('/create-order',{amount:amount*100})
        const order = data
        console.log(order)
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Read Again", 
          description: "Payment for your order", 
          order_id: order.id,
          handler: async (response) => {
            try {
            await axiosRazorpayInstance.post('/verify-payment',{
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
            })
            resolve({success:true,message:"Payment Success"})
            } catch (err) {
              reject({success:false , message:"Payment Failed"})
            }
          },
          prefill: {
            name:data?.user?.username, 
            email: data?.user?.email
            //contact: "9999999999",
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        }
        const rzpay = new Razorpay(options);
        rzpay.open(options);
      }catch(err){
        console.log(err)
      }
    })
  }
  const handleCouponApply=async()=>{
    try {
      if(coupon.trim() == ""){
        return toast.error("Enter a coupon code")
       }
      const {data}= await axiosCouponInstance.post('/verify-coupon',{coupon,amount:cart.totalAmount})
      //console.log(data.discountedPrice)
      setTotalAmount(x=>x-data.discountedPrice)
      setIssCouponApplied(true)
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  const handleCouponRemove=()=>{
    setIssCouponApplied(false)
    setTotalAmount(cart.totalAmount)
    setCoupon('')
  }
  return (
    <section className="checkout section--lg">
      <div className="checkout__container container grid">
        <div className="checkout__group">
          <Addresses userAddresses={addresses} userId={userId} />
        </div>

        <div className="checkout__group">
          <h3 className="section__title">Cart Totals</h3>
          <Table className="order__table">
            <thead>
              <tr>
                <th colSpan="2">Products</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {
                cart?.items?.map((item) => {
                  return <tr>
                    <td>
                      <img
                        src={bookImages+item?.productId?._id+"/"+item?.productId?.images[0]} 
                        alt=""
                        className="order__img"
                      />
                    </td>
                    <td>
                      <h3 className="table__title">{item?.productId?.title}</h3>
                      <p className="table__quantity">{item?.quantity}</p>
                    </td>
                    <td><span className="table__price">₹{item?.quantity * getPrice(item.productId)}</span></td>
                  </tr>
                })
              }
              <tr>
               
              
              
              </tr>
              <tr>
                <td><span className="order__subtitle">Cart Total</span></td>
                <td colSpan="2"><span className="table__price">₹{cart?.totalAmount}</span></td>
              </tr>
              <tr>
                <td><span className="order__subtitle">Shipping</span></td>
                <td colSpan="2">
                  <span className="table__price">Free Shipping</span>
                </td>
              </tr>
              <tr>
                <td><span className="order__subtitle">Total</span></td>
                <td colSpan="2">
                  <span className="order__grand-total">₹{totalAmount}</span>
                </td>
              </tr>
            </tbody>
          </Table>
          <div>
           
            <div className=''>
              {
                isCouponApplied ? <h5 style={{color:'green' }}><em>Congratulations! You have successfully applied the coupon "{coupon}"
                 and received ₹{cart.totalAmount - totalAmount} off on your purchase.</em></h5> : <>
                 <h5>Apply Coupon</h5>
                 <input type="text" placeholder="Your Coupon Code"
                className="form__input w-75"
                value={coupon}
                onChange={(e)=>setCoupon(e.target.value)}
                disabled={isCouponApplied}
              />
                </>
              }
              {
                isCouponApplied ?  <button className='primary-btn' onClick={handleCouponRemove}>Remove</button> 
                : <button className='primary-btn' onClick={handleCouponApply}>Apply</button>
              }
            </div>
          
             
          </div>

          <div className="payment__methods">
            <h3 className="checkout__title payment__title">Payment</h3>
            <div className="payment__option flex">
              <input
                type="radio"
                name="paymentMethod"
                id="bankTransfer"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={handleMethodChange}
                className="payment__input"
              />
              <label htmlFor="bankTransfer" className="payment__label">
                Cash On Delivery
              </label>
            </div>
            <div className="payment__option flex">
              <input
                type="radio"
                name="paymentMethod"
                id="checkPayment"
                value="Razorpay"
                checked={paymentMethod === "Razorpay"}
                onChange={handleMethodChange}
                className="payment__input"
              />
              <label htmlFor="checkPayment" className="payment__label">
                Razorpay
              </label>
            </div>
            <div className="payment__option flex">
              <input
                type="radio"
                name="paymentMethod"
                id="paypal"
                value="Wallet"
                checked={paymentMethod === "Wallet"}
                onChange={handleMethodChange}
                className="payment__input"
              />
              <label htmlFor="paypal" className="payment__label">
                Wallet
              </label>
            </div>
          </div>
          <Button className="btn btn--md" onClick={handlePlaceOrder} disabled={isPlacingOrder}>Place Order</Button>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
