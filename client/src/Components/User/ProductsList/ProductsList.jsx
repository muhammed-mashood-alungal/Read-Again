import React, { useState } from 'react';
import './ProductList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'reactstrap';
import { bookImages } from '../../../redux/Constants/imagesDir';
import { Link } from 'react-router-dom';

const ProductList = ({books,title}) => {
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
                    <a href="#" className="action__btn" aria-label="Add to Wishlist"><i className="fi fi-rs-heart"></i></a>
                  </div>
                  <div className="product__badge ">New</div>
                </div>
                <div className="product__content">
                  <span className="product__category">{book?.category?.name}</span>
                  <button ><h3 className="product__title no-underline">{book.title}</h3></button>
                  <div className="product__rating no-hover-underline">
                    <i className="fi fi-rs-star no-hover-underline"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                  </div>
                  <div className="product__price flex">
                    <span className="new__price">{book?.physical?.price}</span>
                  </div>
                  <span href="#" className="action__btn cart__btn" aria-label="Add To Cart"><i className="fi fi-rs-shopping-bag-add"></i></span>
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
