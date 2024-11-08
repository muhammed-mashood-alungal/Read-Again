import React, { useState } from 'react';
import './ProductList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'reactstrap';

const ProductList = () => {
  const [activeTab, setActiveTab] = useState('#featured');

  const handleTabClick = (target) => {
    setActiveTab(target);
  };

  // Example product data (this can be replaced with actual data)
  const products = [
    { id: 1, title: "Colorful Pattern Shirts", price: "$238.85", oldPrice: "$245.8" },
    { id: 2, title: "Stylish Coat", price: "$155.90", oldPrice: "$170.5" },
    { id: 3, title: "Denim Jacket", price: "$85.75", oldPrice: "$100.0" },
    { id: 4, title: "Casual Tee", price: "$45.50", oldPrice: "$50.0" },
    { id: 5, title: "Formal Pants", price: "$70.95", oldPrice: "$80.0" },
    // Add more products as needed
  ];

  return (
    <Container>
      <section className="products container section">
        <div className="tab__btns">
          <span className={`tab__btn ${activeTab === '#featured' ? 'active-tab' : ''}`} onClick={() => handleTabClick('#featured')}>Featured</span>
          <span className={`tab__btn ${activeTab === '#popular' ? 'active-tab' : ''}`} onClick={() => handleTabClick('#popular')}>Popular</span>
          <span className={`tab__btn ${activeTab === '#new-added' ? 'active-tab' : ''}`} onClick={() => handleTabClick('#new-added')}>New Added</span>
        </div>

        <Row>
          {activeTab === '#featured' && products.map((product, index) => (
            <Col key={product.id} md="4" lg="3" className="mb-4">
              <div className="product__item">
                <div className="product__banner">
                  <a href="details.html" className="product__images">
                    <img src={`assets/img/product-${index + 1}-1.jpg`} alt={product.title} className="product__img default" />
                    <img src={`assets/img/product-${index + 1}-2.jpg`} alt={product.title} className="product__img hover" />
                  </a>
                  <div className="product__actions">
                    <a href="#" className="action__btn" aria-label="Quick View"><i className="fi fi-rs-eye"></i></a>
                    <a href="#" className="action__btn" aria-label="Add to Wishlist"><i className="fi fi-rs-heart"></i></a>
                    <a href="#" className="action__btn" aria-label="Compare"><i className="fi fi-rs-shuffle"></i></a>
                  </div>
                  <div className="product__badge light-pink">Hot</div>
                </div>
                <div className="product__content">
                  <span className="product__category">Clothing</span>
                  <a href="details.html"><h3 className="product__title">{product.title}</h3></a>
                  <div className="product__rating">
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                  </div>
                  <div className="product__price flex">
                    <span className="new__price">{product.price}</span>
                    <span className="old__price">{product.oldPrice}</span>
                  </div>
                  <a href="#" className="action__btn cart__btn" aria-label="Add To Cart"><i className="fi fi-rs-shopping-bag-add"></i></a>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  );
};

export default ProductList;
