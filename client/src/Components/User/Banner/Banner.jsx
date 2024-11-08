import React from 'react'; 

const Banner = () => {
  return (
    <section className="home section--lg">
      <div className="home__container container grid">
        <div className="home__content">
          <span className="home__subtitle">Hot Promotions</span>
          <h1 className="home__title">
            Fashion Trending <span>Great Collection</span>
          </h1>
          <p className="home__description">
            Save more with coupons & up to 20% off
          </p>
          <a href="shop.html" className="btn">Shop Now</a>
        </div>
        <img src="assets/img/home-img.png" className="home__img" alt="hats" />
      </div>
    </section>
  );
}

export default Banner;
