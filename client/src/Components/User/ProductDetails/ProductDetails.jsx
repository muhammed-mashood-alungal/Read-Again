import React, { useCallback, useEffect, useState } from "react";
import { bookImages } from "../../../redux/Constants/imagesDir";
import './ProductDetails.css'
import { RedoDot } from "lucide-react";
const ProductDetails = ({bookData}) => {
  const [activeTab, setActiveTab] = useState("info");
  const [images,setImages] =useState([])
  const [zoom, setZoom] = useState({
    display: "none",
    zoomX: "0%",
    zoomY: "0%",
    backgroundImage: "",
  });
  const [selectedFormat,setSelectedFormat]=useState("physical")
  const [price,setPrice]=useState(null)
  useState(()=>{
      if(bookData){
        setPrice(bookData?.formats?.physical?.price)
      }
  },[])

  // Handle mouse move over image
  const handleMouseMove = (event) => {
    const imageZoom = event.currentTarget;
    const pointer = {
      x: (event.nativeEvent.offsetX * 100) / imageZoom.offsetWidth,
      y: (event.nativeEvent.offsetY * 100) / imageZoom.offsetHeight,
    };
   
    setZoom((prevZoom) => ({
      ...prevZoom,
      display: "block",
      zoomX: `${pointer.x}%`,
      zoomY: `${pointer.y}%`,
    }));
  };

  // Handle mouse out of image
  const handleMouseOut = () => {
    setZoom((prevZoom) => ({
      ...prevZoom,
      display: "none",
    }));
  };

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Set images from bookData
  useEffect(() => {
    if (bookData.images) {
      setImages([...bookData.images]);
      // Set the initial zoom background image to the first image
      setZoom((prevZoom) => ({
        ...prevZoom,
        backgroundImage: `url(${bookImages + bookData._id + "/" + bookData.images[0]})`,
      }));
    }
  }, [bookData]);

  // Handle image click for small images
  const handleImageClick = (index) => {
    let newArr = [...images];
    let temp = newArr[0];
    newArr[0] = newArr[index];
    newArr[index] = temp;
    setImages(newArr);

    // Update zoom background image with the new selected image
    setZoom((prevZoom) => ({
      ...prevZoom,
      backgroundImage: `url(${bookImages + bookData._id + "/" + newArr[0]})`,
    }));
  };

   const renderPrice = () => {
    if (!bookData?.formats || !selectedFormat) {
      return <td>N/A</td>;
    }

    const price = bookData.formats[selectedFormat]?.price;
    return <td>{price ? `₹${price}` : 'NO stock Available'}</td>;
  };

  return (
    <>
      <section className="details section--lg">
        <div className="details__container container grid">
          <div className="details__group">
          <div
              className="imageZoom"
              style={{
                "--url": zoom.backgroundImage,
                "--zoom-x": zoom.zoomX,
                "--zoom-y": zoom.zoomY,
                "--display": zoom.display,
              }}
              onMouseMove={handleMouseMove}
              onMouseOut={handleMouseOut}
            >
              <img
                src={bookImages + bookData._id + "/" + images[0]}
                alt="Product"
                className="details__img Zoomable"
              />
            </div>
          
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
              <span className="new__price">{bookData?.formats?.physical?.price }</span>
              <span className="old__price">{bookData?.formats?.physical?.price}</span>
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

            

            <div className="details__size flex">
              <span className="details__size-title">Available Formats</span>
              <ul>
  {bookData?.formats?.physical.price && (
    <li className="size__link size-active mt-2">Physical Book</li>
  )}

  {bookData?.formats?.ebook?.price && (
    <li className="size__link size-active mt-2">e-Book</li>
  )}

  {bookData?.formats?.audiobook?.price && (
    <li className="size__link size-active mt-2">Audio Book</li>
  )}
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
                  <tr><th>Published Date</th><td>{bookData?.publicationDate}</td></tr>
                  <tr><th>Stock Status</th>{renderPrice() }</tr>
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
                  <img src="/assets/img/avatar-1.jpg" alt="Reviewer" className="review__img" />
                  <h4 className="review__title">Jacky Chan</h4>
                  <p className="review__description">Fast shipping from Poland.</p>
                  <span className="review__date">December 4, 2022 at 3:12 pm</span>
                </div>
                <div className="review__single flex-column-left ">
                  <img src="/assets/img/avatar-1.jpg" alt="Reviewer" className="review__img" />
                  <h4 className="review__title">Jacky Chan</h4>
                  <p className="review__description">Fast shipping from Poland.</p>
                  <span className="review__date">December 4, 2022 at 3:12 pm</span>
                </div>
                <div className="review__single flex-column-left ">
                  <img src="/assets/img/avatar-1.jpg" alt="Reviewer" className="review__img" />
                  <h4 className="review__title">Jacky Chan</h4>
                  <p className="review__description">Fast shipping from Poland.</p>
                  <span className="review__date">December 4, 2022 at 3:12 pm</span>
                </div>
              </div>

              <div className="review__form">
                <h4 className="review__form-title">Add a review</h4>
                <div className="rate__product">
                  <i className="fi fi-rs-star"></i>
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
