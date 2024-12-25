import React, { useEffect, useState } from 'react';
import {
  Col,
  Container,
  Row,
  Table
} from 'reactstrap';
import { useNavigate } from 'react-router-dom'
import { axiosCartInstance, axiosCouponInstance } from '../../../redux/Constants/axiosConstants';
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import ConfirmationModal from '../../CommonComponents/ConfirmationModal/ConfirmationModal';
import './ShoppingCart.css'
import debounce from 'lodash/debounce';
import { decCartItemCount, incCartItemCount } from '../../../redux/Actions/userActions';

const ShoppingCart = () => {
  const dispatch = useDispatch()
  const { userId } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const [cart, setCart] = useState({})
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [availableCoupons, setAvailabeCoupons] = useState([])

  useEffect(() => {
    if (!userId) {
      return
    } else {
      const fetchCartData = async () => {
        try {
          const { data } = await axiosCartInstance.get(`/${userId}`)
          setCart(data.cart ? data.cart : {})
        } catch (err) {
          navigate('/login')
          toast.error("Something Went Wrong. Please try later")
        }
      }
      fetchCartData()
    }
  }, [userId])

  useEffect(() => {
    async function fetchAvailablecoupons() {
      try {
        const { data } = await axiosCouponInstance.get(`/${userId}/available-coupons`)
        setAvailabeCoupons(data?.availableCoupons)
      } catch (err) {
        setAvailabeCoupons(err?.response?.data?.availableCoupons)
      }
    }
    if (userId) {
      fetchAvailablecoupons()
    }
  }, [userId])

  const handleQuantiyChange = debounce(async (value, index, productPrice) => {
    try {
      const items = [...cart.items]
      const priceInc = (value * productPrice) - (items[index].quantity * productPrice)
      const quantityInc = value - items[index].quantity
      if (quantityInc > 0) {
        dispatch(incCartItemCount(1))
      } else {
        dispatch(decCartItemCount(-1))
      }


      await axiosCartInstance.put(`/${userId}/update-quantity`, { value, index, priceInc })
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
  }, 300)

  const handleRemoveFromCart = async () => {
    try {
      const newAmount = cart.totalAmount - (cart.items[selectedIndex].quantity * getPrice(cart.items[selectedIndex].productId))
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
      toast.error(err?.response?.data?.message)
    } finally {
      setSelectedIndex(-1)
    }
  }
  const onCancel = () => {
    setSelectedIndex(-1)
  }

  const loadCheckOut = () => {
    cart.items = cart.items.filter((item) => {
      if (item.productId.stockStatus != "Stock Out") {
        return item
      } else {
        cart.totalAmount = cart.totalAmount - (getPrice(item.productId) * item.quantity)
        cart.totalQuantity = cart.totalQuantity - (item.quantity)
      }
    })

    navigate('/checkout', { state: { cart } })
  }

  const getPrice = (book) => {
    if (book?.appliedOffer?.isActive && book.formats.physical.offerPrice) {
      return book.formats.physical.offerPrice
    }
    return book.formats.physical.price
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
                            src={item?.productId?.images[0].secure_url}
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
                          <span className="table__price">₹{getPrice(item.productId)}</span>
                        </td>
                        <td>
                          {
                            item.productId.stockStatus == "Stock Out" ?
                              <input type="text" value={item.quantity} className="quantity"
                              /> :
                              <input type="number" value={item.quantity} className="quantity"
                                min="1"
                                onChange={(e) => { handleQuantiyChange(e.target.value, index, getPrice(item.productId)) }}
                              />
                          }

                        </td>
                        <td
                          className={`${item?.productId?.stockStatus == "Stock Out" && "prod-stock-out"}
                          ${item?.productId?.stockStatus == "Hurry Up" && 'prod-hurry-up'}
                          ${item?.productId?.stockStatus == "In Stock" && 'prod-in-stock'}`
                          }
                        >{item?.productId?.stockStatus}</td>
                        <td>
                          <span className="subtotal">₹{getPrice(item.productId) * item.quantity}</span>
                        </td>
                        <td>
                          <i className="fi fi-rs-trash table__trash"
                            onClick={(e) => {
                              setSelectedIndex(index)
                            }}></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className='container'>
                <Row>
                  <Col>
                    <div class="cart__total">
                      <h3 class="section__title">Available Coupons</h3>
                      {
                        availableCoupons.length > 0 ? <table class="cart__total-table">
                          {availableCoupons.map((coupon) => {
                            return <tr>
                              <td>
                                <span class="cart__total-title d-flex justify-content-center">{coupon.code}
                                </span>
                              </td>
                              <td>
                                <span class="cart__total-price d-flex justify-content-center">
                                  {coupon.discountValue}% off
                                </span>
                              </td>
                            </tr>
                          })}
                        </table> :
                          <h4 className='empty-msg'>No Available Coupons</h4>
                      }
                    </div>
                  </Col>
                  <Col>
                    <div class="cart__total">
                      <h3 class="section__title">Cart Totals</h3>
                      <table class="cart__total-table">
                        <tr>
                          <td><span class="cart__total-title">Total Quantity</span></td>
                          <td><span class="cart__total-price">{cart?.totalQuantity}</span></td>
                        </tr>
                        <tr>
                          <td><span class="cart__total-title">Total Amount </span></td>
                          <td><span class="cart__total-price">₹{cart?.totalAmount}</span></td>
                        </tr>
                      </table>
                      <button href="checkout.html" class="primary-btn mt-3 flex btn--md" onClick={loadCheckOut}>
                        <span><i class="fi fi-rs-box-alt"></i> Checkout</span>
                      </button>
                    </div>

                  </Col>
                </Row>
              </div>
            </>
        }
      </Container>
    </section>
  );
};

export default ShoppingCart;

