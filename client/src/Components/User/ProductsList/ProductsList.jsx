import React, { useEffect, useState } from 'react';
import './ProductList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'reactstrap';
import { bookImages } from '../../../redux/Constants/imagesDir';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToWishlist } from '../../../redux/Actions/userActions';
import { toast } from 'react-toastify';
const ProductList = ({books,title}) => {

  const {userId} = useSelector(state=>state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const handleAddToCart=(e,book)=>{
  if(!userId){
    navigate('/login')
    toast.error("Login First for Add to cart")
  }
  e.preventDefault()
  const itemInfo={
    productId:book,
    quantity:1
  }
  dispatch(addToCart(userId,itemInfo))
  }

  const handleAddToWishlist=(e,itemId)=>{
    if(!userId){
      navigate('/login')
      toast.error("Login First for Add to Wishlist")
    }
    e.preventDefault()
    dispatch(addToWishlist(userId,itemId))
  }
  const renderProductPrice=(book)=>{
    const formats = book.formats
    if(formats?.physical?.offerPrice != null && book?.appliedOffer?.isActive){
     return <>
      <span className='new__price'>₹{formats?.physical?.offerPrice}</span>
      <span className='old__price'>₹{formats?.physical?.price}</span>
     </>
    }else{
     return  <span className='new__price'>₹{formats?.physical?.price}</span>
    }
 }

  return (
    <Container>
      <section className="products container section">
        <Row>
        <h3 className="section__title">
        <span>{title}</span>
         </h3>
          {books?.length > 0  && books?.map((book, index) => (
            <Col key={book._id} md="4" lg="3" className="mb-4">
              <Link to={`/book-details/${book._id}`} className='no-underline'>
              <div className="product__item">
                <div className="product__banner">
                  <Link to={`/book-details/${book._id}`} className="product__images">
                     <img src={bookImages+book._id +"/" + book.images[0]} alt={book.title} className="product__img default" />
                     <img src={bookImages+book._id +"/" + book.images[1]} alt={book.title} className="product__img hover" />
                  </Link>
                  <div className="product__actions">
                    <a href="#" className="action__btn" aria-label="Quick View"><i className="fi fi-rs-eye"></i></a>
                    <a href="#" className="action__btn" aria-label="Add to Wishlist" onClick={(e)=>{handleAddToWishlist(e,book._id)}}><i className="fi fi-rs-heart"></i></a>
                  </div>
                  <div className="product__badge ">New</div>
                </div>
                <div className="product__content">
                  <span className="product__category">{book?.category?.name}</span> <br />
                  <button ><h3 className="product__title no-underline">{book.title}</h3></button>
                  <div className="product__rating no-hover-underline">
                    <i className="fi fi-rs-star no-hover-underline"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                  </div>
                  <div className="product__price flex">
                    {renderProductPrice(book)}
                  </div>
                  <span onClick={(e)=>{handleAddToCart(e,book)}} className="action__btn cart__btn" aria-label="Add To Cart"><i className="fi fi-rs-shopping-bag-add"></i></span>
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
