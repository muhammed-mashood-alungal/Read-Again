import React from 'react';
import './Categories.css'; 

const CategoriesSection = () => {
  return (
    <section className="categories container section">
      <h3 className="section__title">
        <span>Popular</span> Categories
      </h3>
      <div className="categories__container">
        <a href="shop.html" className="category__item">
          <img src="assets/img/category-1.jpg" alt="" className="category__img" />
          <h3 className="category__title">T-Shirt</h3>
        </a>
        <a href="shop.html" className="category__item">
          <img src="assets/img/category-2.jpg" alt="" className="category__img" />
          <h3 className="category__title">Bags</h3>
        </a>
        <a href="shop.html" className="category__item">
          <img src="assets/img/category-3.jpg" alt="" className="category__img" />
          <h3 className="category__title">Sandal</h3>
        </a>
        <a href="shop.html" className="category__item">
          <img src="assets/img/category-4.jpg" alt="" className="category__img" />
          <h3 className="category__title">Scarf Cap</h3>
        </a>
        <a href="shop.html" className="category__item">
          <img src="assets/img/category-5.jpg" alt="" className="category__img" />
          <h3 className="category__title">Shoes</h3>
        </a>
        <a href="shop.html" className="category__item">
          <img src="assets/img/category-6.jpg" alt="" className="category__img" />
          <h3 className="category__title">Pillowcase</h3>
        </a>
        
      </div>
    </section>
  );
};

export default CategoriesSection;
