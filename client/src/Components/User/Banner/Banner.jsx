import React from 'react'; 
import { Link } from 'react-router-dom';
import './Banner.css'
const Banner = () => {
  
  return (
    <section className="home section--lg">
      <div className="home__container container grid">
        <div className="home__content">
          <span className="home__subtitle">Get New Book</span>
          <h1 className="home__title">
            Books are unique<span> Portable Magic</span>
          </h1>
          <p className="home__description">
            Save more with coupons & up to 20% off
          </p>
          <Link to={'/library'}>
          <button className="primary-btn">Shop Now</button>
          </Link>
        </div>
        <div>

        <img src="assets/img/creative-composition-world-book-day_23-2148883765.png" className="home__img" alt="hats" />
        </div>
      </div>
    </section>
  );
}

export default Banner;
