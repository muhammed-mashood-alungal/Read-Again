import React, { useState } from "react";

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState("info");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      {/* Product Details Section */}
      <section className="details section--lg">
        <div className="details__container container grid">
          {/* Product Image Gallery */}
          <div className="details__group">
            <img
              src="./assets/img/product-8-1.jpg"
              alt="Product"
              className="details__img"
            />
            <div className="details__small-images grid">
              <img
                src="./assets/img/product-8-2.jpg"
                alt="Product Thumbnail"
                className="details__small-img"
              />
              <img
                src="./assets/img/product-8-1.jpg"
                alt="Product Thumbnail"
                className="details__small-img"
              />
              <img
                src="./assets/img/product-8-2.jpg"
                alt="Product Thumbnail"
                className="details__small-img"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="details__group">
            <h3 className="details__title">Henley Shirt</h3>
            <p className="details__brand">
              Brand: <span>adidas</span>
            </p>
            <div className="details__price flex">
              <span className="new__price">$116</span>
              <span className="old__price">$200.00</span>
              <span className="save__price">25% Off</span>
            </div>
            <p className="short__description">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, fuga.
            </p>
            <ul className="products__list">
              <li className="list__item flex">
                <i className="fi-rs-crown"></i> 1 Year Al Jazeera Brand Warranty
              </li>
              <li className="list__item flex">
                <i className="fi-rs-refresh"></i> 30 Days Return Policy
              </li>
              <li className="list__item flex">
                <i className="fi-rs-credit-card"></i> Cash on Delivery available
              </li>
            </ul>

            {/* Color Options */}
            <div className="details__color flex">
              <span className="details__color-title">Color</span>
              <ul className="color__list">
                <li>
                  <a href="#" className="color__link" style={{ backgroundColor: "hsl(37, 100%, 65%)" }}></a>
                </li>
                {/* Add more color options as needed */}
              </ul>
            </div>

            {/* Size Options */}
            <div className="details__size flex">
              <span className="details__size-title">Size</span>
              <ul className="size__list">
                <li><a href="#" className="size__link size-active">M</a></li>
                {/* Add more size options as needed */}
              </ul>
            </div>

            {/* Quantity and Actions */}
            <div className="details__action">
              <input type="number" className="quantity" defaultValue="3" />
              <a href="#" className="btn btn--sm">Add To Cart</a>
              <a href="#" className="details__action-btn"><i className="fi fi-rs-heart"></i></a>
            </div>

            {/* Meta Information */}
            <ul className="details__meta">
              <li className="meta__list flex"><span>SKU:</span>FWM15VKT</li>
              <li className="meta__list flex"><span>Tags:</span>Clothes, Women, Dress</li>
              <li className="meta__list flex"><span>Availability:</span>8 Items in Stock</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Details Tab Section */}
      <section className="details__tab container">
        <div className="detail__tabs">
          <span className={`detail__tab ${activeTab === "info" ? "active-tab" : ""}`} onClick={() => handleTabClick("info")}>Additional Info</span>
          <span className={`detail__tab ${activeTab === "reviews" ? "active-tab" : ""}`} onClick={() => handleTabClick("reviews")}>Reviews(3)</span>
        </div>

        <div className="details__tabs-content">
          {/* Additional Info Tab */}
          {activeTab === "info" && (
            <div className={`details__tab-content ${activeTab == 'info' && "active-tab"}`} id="info">
              <table className="info__table">
                <tbody>
                  <tr><th>Stand Up</th><td>35" L x 24"W x 37-45"H</td></tr>
                  <tr><th>Stand Up</th><td>35" L x 24"W x 37-45"H</td></tr>
                  <tr><th>Stand Up</th><td>35" L x 24"W x 37-45"H</td></tr>
                  {/* Add more rows as needed */}
                </tbody>
              </table>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className={`details__tab-content ${activeTab == 'reviews' && "active-tab"}`} id="reviews">
              <div className="reviews__container grid">
                <div className="review__single">
                  <img src="./assets/img/avatar-1.jpg" alt="Reviewer" className="review__img" />
                  <h4 className="review__title">Jacky Chan</h4>
                  <p className="review__description">Fast shipping from Poland.</p>
                  <span className="review__date">December 4, 2022 at 3:12 pm</span>
                </div>
                {/* Add more review items as needed */}
              </div>

              {/* Review Form */}
              <div className="review__form">
                <h4 className="review__form-title">Add a review</h4>
                <div className="rate__product">
                  <i className="fi fi-rs-star"></i>
                  {/* Add more star icons as needed */}
                </div>
                <form action="" className="form grid">
                  <textarea className="form__input textarea" placeholder="Write Comment"></textarea>
                  <div className="form__group grid">
                    <input type="text" placeholder="Name" className="form__input" />
                    <input type="email" placeholder="Email" className="form__input" />
                  </div>
                  <div className="form__btn">
                    <button className="btn">Submit Review</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
