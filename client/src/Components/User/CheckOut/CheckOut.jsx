import React, { useEffect, useState } from 'react';
import { Button, Table } from 'reactstrap';
import Addresses from '../MyAccount/Addresses';
import { toast } from 'react-toastify';
import { axiosCouponInstance, axiosOrderInstance, axiosRazorpayInstance, axiosUserInstance } from '../../../redux/Constants/axiosConstants';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRazorpay } from 'react-razorpay';

const Checkout = () => {
  const { userId, isLoggedIn } = useSelector(state => state.auth)
  const location = useLocation()
  const cart = location?.state?.cart
  const [addresses, setAddresses] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [coupon, setCoupon] = useState('')
  const [isCouponApplied, setIssCouponApplied] = useState(false)
  const [totalAmount, setTotalAmount] = useState(cart?.totalAmount)
  const navigate = useNavigate()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const { Razorpay } = useRazorpay()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
      toast.error("Login to access Checkout")
    }
  }, [isLoggedIn])
  useEffect(()=>{
    if(!cart){
      navigate('/cart')
    }
  },[cart])

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await axiosUserInstance.get(`/${userId}`)
        setAddresses(response?.data?.userData?.addresses)
      } catch (err) {
        if (userId) {
          toast.error(err?.response?.data?.error)
        }

      }
    }
    getProfileData()
  }, [userId])

  useEffect(() => {
    async function checkWalletBalance() {
      try {
        const { data } = await axiosUserInstance.get(`/wallet/${userId}/get-balance`)
        setWalletBalance(data.balance)
      } catch (err) {
        toast.error(err?.message)
      }
    }
    if (userId) {
      checkWalletBalance()
    }
  }, [userId])

  const handleMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  }

  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true)
      cart.items = cart.items.map((item) => {
        return {
          ...item,
          bookId: item.productId?._id,
          quantity: item.quantity,
          unitPrice: getPrice(item.productId),
          totalPrice: getPrice(item.productId) * item.quantity
        }
      })
      const orderDetails = {
        items: cart.items,
        shippingCharge: 0,
        totalAmount: cart.totalAmount,
        payableAmount: totalAmount,
        orderStatus: "Ordered",
        paymentMethod: paymentMethod,
        coupon: coupon
      }
      const { data } = await axiosOrderInstance.post(`/${userId}/place-order`, orderDetails)

      if (paymentMethod === 'Razorpay') {
        try {
          const result = await handleOnlinePayment(orderDetails.payableAmount)
          if (result.success) {
            await axiosOrderInstance.patch(`/${data.orderId}/payment-success`)
            toast.success("Payment Successful");
          } else {
            toast.error("Payment Failed. You can Retry on Order Page")
          }
        } catch (error) {
          toast.error("Payment failed, please try again.");
        } finally {
          navigate('/order-success', { state: { orderId: data.orderId },replace : true })
          setIsPlacingOrder(false)
        }
      }
      navigate('/order-success', { state: { orderId: data.orderId },replace : true} )
      setIsPlacingOrder(false)
      cart = null
    } catch (err) {
      setIsPlacingOrder(false)
      toast.error(err?.response?.data?.message)
    }
  }

  // const getPrice = (book) => {
  //   if ( book?.appliedOffer && book?.appliedOffer?.isActive ) {
  //     return book.formats.physical.offerPrice
  //   }
  //   return book.formats.physical.price
  // }
  const getPrice = (book) => {
    if (book?.appliedOffer?.isActive) {
      const originalPrice = book.formats?.physical?.price
      const offerPrice = originalPrice - (originalPrice * (book.appliedOffer.discountValue / 100))
      return offerPrice
    }
    return book.formats.physical.price
  } 


  const handleOnlinePayment = (amount) => {
    return new Promise(async (resolve, reject) => {
      try {
        const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_ID;
        const { data } = await axiosRazorpayInstance.post('/create-order', { amount: amount * 100 })
        const order = data
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Read Again",
          description: "Payment for your order",
          order_id: order.id,
          handler: async (response) => {
            try {
              await axiosRazorpayInstance.post('/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
              resolve({ success: true, message: "Payment Success" })
            } catch (err) {
              reject({ success: false, message: "Payment Failed" })
            }
          },
          prefill: {
            name: data?.user?.username,
            email: data?.user?.email
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        }
        const rzpay = new Razorpay(options)

        rzpay.open(options)

        rzpay.on('payment.failed', (response) => {
          console.error("Payment failed", response.error);
          reject({
            success: false,
            message: "Payment failed",
            error: response.error,
          })
        })
      } catch (err) {
        toast.error(err)
      }
    })
  }
  const handleCouponApply = async () => {
    try {
      if (coupon.trim() == "") {
        return toast.error("Enter a coupon code")
      }
      const { data } = await axiosCouponInstance.post('/verify-coupon', { coupon, amount: cart.totalAmount })
      setTotalAmount(x => x - data.discountedPrice)
      setIssCouponApplied(true)
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  const handleCouponRemove = () => {
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
          <div className="table-responsive">
            <Table borderless className="mb-3">
              <tbody>
                <tr>
                  <th className="text-start">Index</th>
                  <th className="text-start">Book</th>
                  <th className='text-start'>Quantity</th>
                  <th className='text-start'>Price</th>
                  <th className='text-start'>Total</th>
                </tr>
                {cart?.items?.map((item, i) => {
                  return <tr>
                    <td className="text-start" >
                      <strong>{i + 1}</strong>
                    </td>
                    <td className="text-start" >
                      <img src={item?.productId?.images[0].secure_url} style={{ width: "25px", height: "25px" }} className='me-2' />
                      <strong>{item?.productId?.title}</strong>
                    </td>
                    <td className="text-start">{item.quantity}</td>
                     <td className="text-start">{getPrice(item.productId)}</td>
                    <td className="text-start">₹{getPrice(item.productId) * item.quantity}</td>
                  </tr>
                })}

              </tbody>
            </Table>
            <Table borderless className="mb-3">
              <tbody>
                <tr>
                  <td className="text-start" style={{ width: '50%' }}>
                    <strong>Cart Total</strong>
                  </td>
                  <td className="text-end">₹{cart?.totalAmount}</td>
                </tr>
                <tr>
                  <td className="text-start">
                    <strong>Shipping</strong>
                  </td>
                  <td className="text-end">Free Shipping</td>
                </tr>
                <tr className="border-top">
                  <td className="text-start">
                    <strong>Total</strong>
                  </td>
                  <td className="text-end">
                    <strong>₹{totalAmount}</strong>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div>

            <div className=''>
              {
                isCouponApplied ? <h5 style={{ color: 'green' }}><em>Congratulations! You have successfully applied the coupon "{coupon}"
                  and received ₹{cart.totalAmount - totalAmount} off on your purchase.</em></h5> : <>
                  <h5>Apply Coupon</h5>
                  <input type="text" placeholder="Your Coupon Code"
                    className="form__input w-75"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    disabled={isCouponApplied}
                  />
                </>
              }
              {
                isCouponApplied ? <button className='primary-btn' onClick={handleCouponRemove}>Remove</button>
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
            {
              walletBalance >= totalAmount && <div className="payment__option flex">
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
            }

          </div>
          <Button className="btn btn--md" onClick={handlePlaceOrder} disabled={isPlacingOrder}>Place Order</Button>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
