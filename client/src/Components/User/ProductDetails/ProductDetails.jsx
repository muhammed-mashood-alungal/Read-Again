import React, { useCallback, useEffect, useState } from "react";
import { bookImages } from "../../../redux/Constants/imagesDir";
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css';

const ProductDetails = ({bookData}) => {
  const [activeTab, setActiveTab] = useState("info");
  const [selected,setSelectedImage] = useState(0)
  const [images,setImages] =useState([])
   const [isZoomed, setIsZoomed] = useState(false)

  const handleZoomChange = useCallback(shouldZoom => {
    setIsZoomed(shouldZoom)
  }, [])
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  useEffect(()=>{
    if(bookData.images){
      console.log(bookData.images)
      setImages([...bookData.images])
    }
  },[bookData])
 
  const handleImageClick=(index)=>{
     let newArr = [...images]
     console.log(newArr)
     let temp = newArr[0]
     newArr[0] = newArr[index]
     newArr[index]=temp

     setImages(newArr)
  }
  

  return (
    <>
      <section className="details section--lg">
        <div className="details__container container grid">
          {/* Product Image Gallery */}
          <div className="details__group">
          <ControlledZoom isZoomed={isZoomed} onZoomChange={handleZoomChange}>
             <img
              src={bookImages+bookData._id+"/"+images[0]}
              alt="Product"
              className="details__img"
            />
            </ControlledZoom>
            <div className="details__small-images grid">
              {images.length != 0  && images.map((image,i)=>{
                return images[i+1] && <img
                src={bookImages+bookData._id+"/"+images[i+1]}
                className="details__small-img"
                onClick={()=>{handleImageClick(i+1)}}
              />
              })}
              
            </div>
          </div>

          {/* Product Details */}
          <div className="details__group">
            <h3 className="details__title">{bookData.title}</h3>
            <p className="details__brand">
              Author: <span>{bookData.author}</span>
            </p>
            <div className="details__price ">
              <div className="flex">
              <span className="new__price">{bookData?.physical?.price || 300}</span>
              <span className="old__price">{bookData?.physical?.price || 499}</span>
              <span className="save__price">25% Off</span>
              </div>
              <div>
              <div className="product__rating">
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                  </div>
              </div>
             
            </div>
            <p className="short__description">
             {bookData.description}
            </p>
            <p className="meta__list flex"><span>Languages :</span> English, Malayalam, Hindi</p>
            <ul className="products__list">
              <li className="list__item flex">
                <i className="fi-rs-crown"></i>Gift Wrapping Available
              </li>
              <li className="list__item flex">
                <i className="fi-rs-refresh"></i> Borrowing Available for you
              </li>
              <li className="list__item flex">
                <i className="fi-rs-credit-card"></i> {"Cash on Delivery available"}
              </li>
              
            </ul>

            

            {/* Size Options */}
            <div className="details__size flex">
              <span className="details__size-title">Available Formats</span>
              <ul className="size__list">
                <li  className="size__link size-active mt-2">Physical Book</li>
                <li  className="size__link size-active mt-2">e-Book</li>
                <li  className="size__link size-active mt-2">Audio Book</li>
              </ul>
            </div>

            {/* Quantity and Actions */}
            <div className="details__action">
              <input type="number" className="quantity" defaultValue="3" />
              <a href="#" className="details__action-btn"><i className="fi fi-rs-heart"></i></a>
              <button  className="primary-btn">Add To Cart</button>
              <button  className="primary-btn">Buy Now</button>
              <button  className="primary-btn">Borrow</button>
              
              
            </div>

            {/* Meta Information */}
            
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
              <table className="info__table mb-4">
                <tbody>
                  <tr><th>Author</th><td> {bookData.author}</td></tr>
                  <tr><th>Published Date</th><td>{bookData.publicationDate}</td></tr>
                  <tr><th>Page Count</th><td>348</td></tr>
                  {/* Add more rows as needed */}
                </tbody>
              </table>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className={`details__tab-content ${activeTab == 'reviews' && "active-tab"}`} id="reviews">
              <div className="reviews__container grid">
                <div className="review__single flex-column-left ">
                  <img src="./assets/img/avatar-1.jpg" alt="Reviewer" className="review__img" />
                  <h4 className="review__title">Jacky Chan</h4>
                  <p className="review__description">Fast shipping from Poland.</p>
                  <span className="review__date">December 4, 2022 at 3:12 pm</span>
                </div>
                <div className="review__single flex-column-left ">
                  <img src="./assets/img/avatar-1.jpg" alt="Reviewer" className="review__img" />
                  <h4 className="review__title">Jacky Chan</h4>
                  <p className="review__description">Fast shipping from Poland.</p>
                  <span className="review__date">December 4, 2022 at 3:12 pm</span>
                </div>
                <div className="review__single flex-column-left ">
                  <img src="./assets/img/avatar-1.jpg" alt="Reviewer" className="review__img" />
                  <h4 className="review__title">Jacky Chan</h4>
                  <p className="review__description">Fast shipping from Poland.</p>
                  <span className="review__date">December 4, 2022 at 3:12 pm</span>
                </div>
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
