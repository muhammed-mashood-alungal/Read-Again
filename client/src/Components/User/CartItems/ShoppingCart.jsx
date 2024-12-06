import React, { useEffect, useState } from 'react';
import {
  Container,
  Table
} from 'reactstrap';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { axiosCartInstance } from '../../../redux/Constants/axiosConstants';
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import ConfirmationModal from '../../ConfirmationModal/ConfirmationModal';
import './ShoppingCart.css'
import { bookImages } from '../../../redux/Constants/imagesDir';
import debounce from 'lodash/debounce';
import { decCartItemCount, incCartItemCount } from '../../../redux/Actions/userActions';

const ShoppingCart = () => {
 const dispatch = useDispatch()
  const { userId } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const [cart, setCart] = useState({})
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isProcessing,setIsProcessing]=useState(false)
  useEffect(() => {
    if (!userId) {
      navigate("/login", { state: { cart } })
    } else {
      const fetchCartData = async () => {
        try {
          const { data } = await axiosCartInstance.get(`/${userId}`)
          console.log(data.cart)
          setCart(data.cart ? data.cart : {})
        } catch (err) {
          console.log(err)
          navigate('/login')
          toast.error("Something Went Wrong. Please try later")
        }
      }
      fetchCartData()
    }
  }, [userId])

  const handleQuantiyChange = debounce(async (value, index, productPrice) => {
    try {
      
      const items = [...cart.items]
    
      const priceInc = (value * productPrice) - (items[index].quantity * productPrice)
      const quantityInc = value - items[index].quantity
      console.log(quantityInc)
      if(quantityInc > 0){
        console.log("incr")
       dispatch(incCartItemCount(1))
      }else{
        console.log("dec")
        dispatch(decCartItemCount(-1))
      }
     
      console.log(cart.totalAmount, value)
      const response=await axiosCartInstance.put(`/${userId}/update-quantity`, { value, index, priceInc })
      if (value > 3) {
        items[index].quantity = 3
      } else {
        items[index].quantity = value
      }
      setCart(cart => {
        return {
          ...cart,
          items: items,
          totalQuantity: cart.totalQuantity + quantityInc,
          totalAmount: cart.totalAmount + priceInc
        }
      })

    } catch (err) {
      if (err.response?.status == 400) {
        toast.error(err?.response?.data?.message)
      }
    }
  }, 300);
  const handleRemoveFromCart = async () => {
    try {
      console.log(cart.totalAmount - (cart.items[selectedIndex].quantity * cart.items[selectedIndex]?.productId?.formats?.physical?.price))
      const newAmount = cart.totalAmount - (cart.items[selectedIndex].quantity * cart.items[selectedIndex]?.productId?.formats?.physical?.price)
      const newQuantity = cart.totalQuantity - cart.items[selectedIndex].quantity
      await axiosCartInstance.put(`/${userId}/remove-item`, { index: selectedIndex, newAmount, newQuantity })
      toast.success("Item Removed")
      setCart(cart => {
        const items = cart?.items?.filter((_, idx) => {
          return idx != selectedIndex
        })
        return {
          ...cart, items: items,
          totalQuantity: newQuantity,
          totalAmount: newAmount
        }
      })
      setSelectedIndex(-1)
      dispatch(decCartItemCount(cart.items[selectedIndex].quantity))
    } catch (err) { 
      console.log(err)
      toast.error(err?.response?.data?.message)
    } finally {
      setSelectedIndex(-1)
    }
  }
  const onCancel = () => {
    setSelectedIndex(-1)
  }
  
  const loadCheckOut=()=>{
    cart.items = cart.items.filter((item)=>{
      console.log(item.productId.stockStatus)
      if(item.productId.stockStatus != "Stock Out"){
        return item
      }else{
        cart.totalAmount = cart.totalAmount - (item.productId.formats.physical.price * item.quantity)
        cart.totalQuantity = cart.totalQuantity - (item.quantity)
      }
    })
    console.log(cart)
    navigate('/checkout',{state:{cart}})
  }
  return (
    <section className="section--lg">
      {
        selectedIndex > -1 &&
        <ConfirmationModal
          title={`Are You Sure to Remove This Item From cart ?`}
          onConfirm={handleRemoveFromCart}
          onCancel={onCancel} />

      }
      <Container>

        {/* Cart Table */}
        {
          cart?.items?.length == 0 ?
            <h1 className='empty-msg'>Your Cart is Empty</h1>
            :
            <>
              <div className="table__container">
                <Table responsive className="table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Subtotal</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>

                    {cart?.items?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <img
                            src={bookImages+item?.productId._id+"/"+item?.productId?.images[0]} 
                            alt="Product"
                            className="table__img"
                          />
                        </td>
                        <td>
                          <h3 className="table__title"></h3>
                          <p className="table__description">
                            {item?.productId?.title}
                          </p>
                        </td>
                        <td>
                          <span className="table__price">{item.productId?.formats?.physical?.price}</span>
                        </td>
                        <td>
                          {
                            item.productId.stockStatus == "Stock Out" ?
                            <input type="text" value={item.quantity} className="quantity"
                           // onChange={(e) => { handleQuantiyChange(e.target.value, index, item?.productId?.formats?.physical?.price) }}
                          /> :
                          <input type="number" value={item.quantity} className="quantity"
                          min="1"
                          onChange={(e) => { handleQuantiyChange(e.target.value, index, item?.productId?.formats?.physical?.price) }}
                        />
                          }
                          
                        </td>
                        <td
                          className={`${item?.productId?.stockStatus == "Stock Out" && "stock-out"}
                          ${item?.productId?.stockStatus == "Hurry Up" && 'hurry-up'}
                          ${item?.productId?.stockStatus == "In Stock" && 'in-stock'}`
                          }
                        >{item?.productId?.stockStatus}</td>
                        <td>
                          <span className="subtotal">{item.productId?.formats?.physical?.price * item.quantity}</span>
                        </td>
                        <td>
                          <i className="fi fi-rs-trash table__trash"
                            onClick={(e) => {
                              setSelectedIndex(index)
                              console.log(index)
                            }}></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className='cart-total-section container'>
        <div className="cart-total">
          <h5>Cart Details</h5>
          <hr />
          <table>
            <tr>
              <th>Total Quatity </th>
              <th>{cart?.totalQuantity || "0"}</th>
            </tr>
            <tr>
              <th>Total Price </th>
              <th>₹{cart.totalAmount || "0000"}</th>
            </tr>
          </table>

          <button className='primary-btn mt-3'
            onClick={loadCheckOut}>Check Out</button>
        </div>
      </div>
            </>
        }

      </Container>
     
    </section>
  );
};

export default ShoppingCart;

