import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'reactstrap';
import Addresses from '../MyAccount/Addresses';
import { toast } from 'react-toastify';
import { axiosUserInstance } from '../../../redux/Constants/axiosConstants';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const {userId, isLoggedIn} = useSelector(state=>state.auth)
  const location = useLocation()
  const cart = location?.state?.cart
  
  const [addresses,setAddresses] = useState([])
  const navigate=useNavigate()
  useEffect(()=>{
    if(!isLoggedIn){
      navigate('/login')
      toast.error("Login to access Checkout")
    }
  },[isLoggedIn])
  // useEffect(()=>{
  //   console.log(cart)
  //   if(!cart){
  //     navigate('/cart')

  //   }
  // },[cart])
  useEffect(()=>{
    const getProfileData =async()=> {
      try{
        console.log(userId)
        const response = await axiosUserInstance.get(`/${userId}`)
        setAddresses(response?.data?.userData?.addresses)
      }catch(err){
        console.log(err)
        if(userId){
           toast.error(err?.response?.data?.error)
        }
       
      }
    }
    getProfileData();
  },[userId])
  if(!cart){
    return navigate('/cart')
  }
  return (
    <section className="checkout section--lg">
      <div className="checkout__container container grid">
        <div className="checkout__group">
          
          <Addresses userAddresses={addresses} userId={userId}/>
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
              cart.items.map((item)=>{
                return <tr>
                <td>
                  <img
                    src="./assets/img/product-1-2.jpg"
                    alt=""
                    className="order__img"
                  />
                </td>
                <td>
                  <h3 className="table__title">{item?.productId?.title}</h3>
                  <p className="table__quantity">{item?.quantity}</p>
                </td>
                <td><span className="table__price">{item?.quantity * item?.productId?.formats?.physical?.price}</span></td>
              </tr>  
              })
             }
              
              <tr>
                <td><span className="order__subtitle">Cart Total</span></td>
                <td colSpan="2"><span className="table__price">{cart?.totalAmount}</span></td>
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
                  <span className="order__grand-total">{cart?.totalAmount}</span>
                </td>
              </tr>
            </tbody>
          </Table>

          <div className="payment__methods">
            <h3 className="checkout__title payment__title">Payment</h3>
            <div className="payment__option flex">
              <input
                type="radio"
                name="paymentMethod"
                id="bankTransfer"
                defaultChecked
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
                className="payment__input"
              />
              <label htmlFor="paypal" className="payment__label">
                Wallet
              </label>
            </div>
          </div>
          <Button className="btn btn--md">Place Order</Button>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
