import React, { useEffect, useState } from 'react';
import {
  Container,
  Table
} from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom'
import { axiosCartInstance } from '../../../redux/Constants/axiosConstants';
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import ConfirmationModal from '../../ConfirmationModal/ConfirmationModal';

const ShoppingCart = () => {

  const { userId } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  useEffect(() => {
    if (!userId) {
      navigate("/login")
    } else {
      const fetchCartData = async () => {
        try {
          const { data } = await axiosCartInstance.get(`/${userId}`)
          console.log(data.cart.items)
          setCartItems(data.cart.items)
        } catch (err) {
          console.log(err)
          navigate('/login')
          toast.error("Something Went Wrong. Please try later")
        }
      }
      fetchCartData()
    }
  }, [userId])

  const handleQuantiyChange = async (value, index) => {
    try {
      const items = [...cartItems]
      if (value > 3) {
        items[index].quantity = 3
      } else {
        items[index].quantity = value
      }
      setCartItems(items)
      await axiosCartInstance.put(`/${userId}/update-quantity`, { value, index })
    } catch (err) {
      console.log(err?.response?.data)
      if (err.response?.status == 400) {
        toast.error(err?.response?.data?.message)
      }
    }
  }
  const handleRemoveFromCart = async () => {
    try {
      console.log("removing")
      await axiosCartInstance.put(`/${userId}/remove-item`, { index:selectedIndex })
      toast.success("Item Removed")
      setCartItems(items => {
        return items.filter((_, idx) => {
          return idx != selectedIndex
        })
      })
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
              cartItems.length == 0  ? 
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
                <th>Subtotal</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>

              {cartItems?.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={`./assets/img/product-${index + 1}-1.jpg`}
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
                    <input type="number" value={item.quantity} className="quantity"
                      min="1"
                      onChange={(e) => { handleQuantiyChange(e.target.value, index) }}
                    />
                  </td>
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
            </> 
             }

      </Container>
    </section>
  );
};

export default ShoppingCart;
            
