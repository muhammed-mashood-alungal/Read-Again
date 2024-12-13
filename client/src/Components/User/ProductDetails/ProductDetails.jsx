import React, { useEffect, useState } from "react";
import { bookImages } from "../../../redux/Constants/imagesDir";
import './ProductDetails.css'
import { useDispatch, useSelector } from "react-redux";
import { addToCart, resetCartStates } from "../../../redux/Actions/userActions";
import {  toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const ProductDetails = ({ bookData }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [images, setImages] = useState([])
  const [zoom, setZoom] = useState({
    display: "none",
    zoomX: "0%",
    zoomY: "0%",
    backgroundImage: "",
  });
  const [selectedFormat, setSelectedFormat] = useState("physical")
  const [price, setPrice] = useState(null)
  const [quantity, setQuantity]=useState(1)
  const {userId} = useSelector(state=>state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (bookData && bookData.formats && selectedFormat) {
      setPrice(bookData.formats[selectedFormat]?.offerPrice);
    }
  }, [bookData, selectedFormat]);

 


  // useEffect(() => {
  //   if (bookData.images) {
  //     console.log("useEffet")
  //     console.log(bookData.images)
  //     setImages([...bookData.images])
  //   }
  // }, [bookData])

  useEffect(() => {
    if (bookData.images) {
      const imageUrls = bookData.images.map((image)=>{
        return image.secure_url
      })
      setImages(imageUrls);
      setZoom((prevZoom) => ({
        ...prevZoom,
        backgroundImage: `url(${bookData?.images[0]?.secure_url})`,
      }));
    }
  }, [bookData]);

  const handleQuantityChange=(e)=>{
    setQuantity(e.target.value)
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

  const handleMouseOut = () => {
    setZoom((prevZoom) => ({
      ...prevZoom,
      display: "none",
    }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  

  const handleImageClick = (index) => {
    let newArr = [...images];
    let temp = newArr[0];
    newArr[0] = newArr[index];
    newArr[index] = temp;
    setImages([...newArr]);
    console.log(newArr)
  
    setZoom((prevZoom) => ({
      ...prevZoom,
      backgroundImage: `url(${newArr[0]})`,
    }));
  };

  const handleAddToCart = (book) => {
    if (!userId) {
      navigate('/login')
    }
    const itemInfo = {
      productId: book._id,
      quantity: quantity
    }
    dispatch(addToCart(userId, itemInfo))
  }
  


  const renderStock = () => {
    if (!bookData?.formats || !selectedFormat) {
      return <td>N/A</td>;
    }
    const stock = bookData?.formats[selectedFormat]?.stock;
    if (stock < 1) {
      return <td className="stock-out">Stock Out</td>;
    } else if (stock < 10) {
      return <td className="hurry-up">Hurry Up</td>;
    } else {
      return <td className="in-stock">In Stock</td>;
    }
  }
  const getPrice=(book)=>{
    console.log(book?.appliedOffer)
    if(book?.appliedOffer?.isActive && book.formats.physical.offerPrice){
      return book.formats.physical.offerPrice
    }
    return  book?.formats.physical.price
  }
 
  const buyNow=()=>{
    console.log(bookData?.formats?.physical?.price,quantity)
    try{
       const cart = {}
       cart.totalAmount= getPrice(bookData) * parseInt(quantity)
       cart.quantity =quantity
       cart.items = [{
        productId:{...bookData},
        offer:{},
        quantity:quantity
       }]
       navigate('/checkout',{state:{cart}})
    }catch(err){
        console.log(err)
        toast.error(err?.response?.data.message)
    }
  }
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
               src={images[0]}
                alt="Product"
                className="details__img Zoomable"
              />
            </div>

            <div className="details__small-images grid">
              {images.length != 0 && images.map((image, i) => {
                return images[i + 1] && <img
                  src={images[i+1]}
                  className="details__small-img"
                  onClick={() => { handleImageClick(i + 1) }}
                />
              })}

            </div>
          </div>

          {/* Product Details */}
          <div className="details__group">
            <h3 className="details__title">{bookData?.title}</h3>
            <p className="details__brand">
              Author: <span>{bookData?.author}</span>
            </p>
            <div className="details__price ">
              <div className="flex">
              {renderProductPrice(bookData)}
                {/* <span className="new__price">{bookData.formats[selectedFormat].price}</span>
                <span className="old__price">{bookData.formats[selectedFormat].offerPrice}</span> */}
                <span className="save__price">{bookData?.appliedOffer?.discountValue && `(${bookData?.appliedOffer?.discountValue}%)`}</span>
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
              {bookData?.description}
            </p>
            {/* <p className="meta__list flex"><span>Languages :</span> English, Malayalam, Hindi</p> */}
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
            <span className="details__size-title">Available Formats</span>
            <div className="details__size flex">

              <ul>
                {bookData?.formats?.physical.price && (
                  <li className={`size__link size-active mt-2 ${selectedFormat == "physical" && "selected"}`}
                    onClick={() => { setSelectedFormat("physical") }}
                  >Physical Book</li>
                )}

                {bookData?.formats?.ebook?.price && (
                  <li className={`size__link size-active mt-2 ${selectedFormat == "ebook" && "selected"}`}
                    onClick={() => { setSelectedFormat("ebook") }}
                  >e-Book</li>
                )}

                {bookData?.formats?.audiobook?.price && (
                  <li className={`size__link size-active mt-2 ${selectedFormat == "audiobook" && "selected"}`}
                    onClick={() => { setSelectedFormat("audiobook") }}
                  >Audio Book</li>
                )}
              </ul>
            </div>

            {/* Quantity and Actions */}
            <div className="details__action">
              <input type="number" className="quantity" 
               value={quantity}
              onChange={handleQuantityChange}
              min={1} 
              max={bookData?.formats?.physical?.stock}/>
              <a href="#" className="details__action-btn"><i className="fi fi-rs-heart"></i></a>
              <button className="primary-btn" onClick={(e)=>{handleAddToCart(bookData)}}>Add To Cart</button>
              <button className="primary-btn" onClick={buyNow}>Buy Now</button>
              <button className="primary-btn">Borrow</button>


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
                  <tr><th>Author</th><td> {bookData?.author}</td></tr>
                  <tr><th>Published Date</th><td>{bookData?.publicationDate}</td></tr>
                  <tr><th>Stock Status</th>
                  <th
                  className={`${bookData.stockStatus == "Stock Out" && "stock-out"}
                     ${bookData.stockStatus == "Hurry Up" && 'hurry-up'}
                     ${bookData.stockStatus == "In Stock" && 'in-stock'}`
                     }
                  >{bookData?.stockStatus}</th>
                  </tr>
                  <tr><th>Stock </th><td>{bookData?.formats?.physical?.stock}</td></tr>
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
