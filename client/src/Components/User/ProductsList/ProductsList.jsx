import React from 'react';
import './ProductList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToWishlist } from '../../../redux/Actions/userActions';
import { toast } from 'react-toastify';
import { Rating, Stack } from '@mui/material';

const ProductList = ({ books, title }) => {
  const { userId } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleAddToCart = (e, book) => {
    if (!userId) {
      navigate('/login')
      return toast.error("Login First for Add to cart")
    }
    e.preventDefault()
    const itemInfo = {
      productId: book._id,
      quantity: 1
    }
    dispatch(addToCart(userId, itemInfo))
  }

  const handleAddToWishlist = (e, itemId) => {
    if (!userId) {
      navigate('/login')
     return  toast.error("Login First for Add to Wishlist")
    }
    e.preventDefault()
    dispatch(addToWishlist(userId, itemId))
  }
  const renderProductPrice = (book) => {
    const formats = book.formats
  
    if (book.appliedOffer && book?.appliedOffer?.isActive) {
      const offerPrice = formats?.physical?.price - (formats?.physical?.price * (book?.appliedOffer.discountValue / 100))
      return <>
        <span className='new__price'>₹{offerPrice}</span>
        <span className='old__price'>₹{formats?.physical?.price}</span>
      </>
    } else {
      return <span className='new__price'>₹{formats?.physical?.price}</span>
    }
  }

  return (
    <Container>
      <section className="products container section">
        <Row>
          {
            books.length > 0 && <h3 className="section__title">
              <span>{title}</span>
            </h3>
          }
          {books?.map((book, index) => (
            <Col key={book._id} md="4" lg="3" xs="6" className="mb-4">
              <Link to={`/book-details/${book._id}`} className='no-underline'>
                <div className="product__item">
                  <div className="product__banner">
                    <Link to={`/book-details/${book._id}`} className="product__images">
                      <img src={book.images[0].secure_url} alt={book.title} className="product__img default" />
                      <img src={book.images[1].secure_url} alt={book.title} className="product__img hover" />
                    </Link>
                    <div className="product__actions">
                      <a href="#" className="action__btn" aria-label="Quick View"><i className="fi fi-rs-eye"></i></a>
                      <a href="#" className="action__btn" aria-label="Add to Wishlist" onClick={(e) => { handleAddToWishlist(e, book._id) }}><i className="fi fi-rs-heart"></i></a>
                    </div>
                    <div className={`product__badge ${book.stockStatus == "In Stock" && 'in-stock'}
                  ${book.stockStatus == "Hurry Up" && 'hurry-up'}`}>{book.stockStatus}</div>
                  </div>
                  <div className="product__content">
                    <span className="product__category">{book?.category?.name}</span> <br />
                    <button ><h3 className="product__title no-underline">{book.title}</h3></button>
                    <Stack>
                      <Rating name="half-rating-read" value={book?.averageRating?.toFixed()} readOnly size='small' />
                    </Stack>
                    <div className="product__price flex">
                      {renderProductPrice(book)}
                    </div>
                    <span onClick={(e) => { handleAddToCart(e, book) }} className="action__btn cart__btn" aria-label="Add To Cart"><i className="fi fi-rs-shopping-bag-add"></i></span>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  );
};

export default ProductList;
