import React, { useEffect, useState } from "react";
import './ProductDetails.css'
import { useDispatch, useSelector } from "react-redux";
import { addToCart, addToWishlist } from "../../../redux/Actions/userActions";
import { toast } from 'react-toastify';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";
import { axiosBookInstance } from "../../../redux/Constants/axiosConstants";
import { validateImage } from "../../../validations/imageValidation";
import CIcon from "@coreui/icons-react";
import { cilImagePlus, cilTrash, cilUser } from "@coreui/icons";
import { Dialog } from "@mui/material";

const ProductDetails = ({ bookData }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [images, setImages] = useState([])
  const [reviewImage, setReviewImage] = useState(null)
  const [zoom, setZoom] = useState({
    display: "none",
    zoomX: "0%",
    zoomY: "0%",
    backgroundImage: "",
  });
  const [selectedFormat, setSelectedFormat] = useState("physical")
  const [price, setPrice] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { userId } = useSelector(state => state.auth)
  const [rating, setRating] = useState(2)
  const [reviewText, setReviewText] = useState("")
  const [reviews, setReviews] = useState([])
  const [prodRating, setProdRating] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (bookData && bookData.formats && selectedFormat) {
      setPrice(bookData.formats[selectedFormat]?.offerPrice);
    }
  }, [bookData, selectedFormat]);

  useEffect(() => {
    async function fetchBookReviews() {
      try {
        const { data } = await axiosBookInstance.get(`/${bookData._id}/reviews`)
        setReviews(data.reviews)
      } catch (err) {
        toast.error(err?.message)
      }
    }
    if (bookData?._id) {
      fetchBookReviews()
    }
  }, [bookData])


  useEffect(() => {
    if (bookData.images) {
      const imageUrls = bookData.images.map((image) => {
        return image.secure_url
      })
      setImages(imageUrls);
      setZoom((prevZoom) => ({
        ...prevZoom,
        backgroundImage: `url(${bookData?.images[0]?.secure_url})`,
      }))

    }
    setProdRating(bookData.averageRating)
  }, [bookData])

  const handleSetImage = (file) => {
    if (!validateImage(file)) {
      toast.error("Make sure the image is either .png , .jpg or .jpeg")
      return
    }
    setReviewImage(file)
  }

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value)
  }
  const submitReview = async (e) => {
    try {
      e.preventDefault()
      if (!userId) {
        return toast.error("Login For add Your Review")
      }
      const formData = new FormData()
      formData.append("rating", rating)
      formData.append("reviewText", reviewText)
      if (reviewImage) {
        formData.append("reviewImage", reviewImage)
      }
      await axiosBookInstance.post(`/${bookData._id}/reviews/add/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      toast.success("Your Review Saved Successfully")
      setReviewImage(null)
      setReviewText("")
      setRating(2)
    } catch (err) {
      toast.error(err?.response?.data?.message)
    }
  }


  // const renderProductPrice = (book) => {
  //   const formats = book.formats
  //   if (formats?.physical?.offerPrice != null && book?.appliedOffer?.isActive) {
  //     return <>
  //       <span className='new__price'>₹{formats?.physical?.offerPrice}</span>
  //       <span className='old__price'>₹{formats?.physical?.price}</span>
  //     </>
  //   } else {
  //     return <span className='new__price'>₹{formats?.physical?.price}</span>
  //   }
  // }
  const renderProductPrice = (book) => {
    const formats = book.formats
  
    if (book.appliedOffer && book?.appliedOffer?.isActive) {
      const offerPrice = formats?.physical?.price - (formats?.physical?.price * (book?.appliedOffer.discountValue / 100))
      return <>
        <span className='new__price'>₹{offerPrice}</span>
        <span className='old__price'>₹{formats?.physical?.price}</span>
      </>
    } else {
      return <span className='new__price'>₹{formats?.physical?.price}</span>
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
    let newArr = [...images]
    let temp = newArr[0]
    newArr[0] = newArr[index]
    newArr[index] = temp
    setImages([...newArr])

    setZoom((prevZoom) => ({
      ...prevZoom,
      backgroundImage: `url(${newArr[0]})`,
    }));
  };

  const handleAddToCart = (book) => {
    if (!userId) {
     return navigate('/login')
    }
    const itemInfo = {
      productId: book._id,
      quantity: quantity
    }
    dispatch(addToCart(userId, itemInfo))
  }
  const handleAddToWishlist = ()=>{
    if(!userId){
      return navigate('/login')
    }
     dispatch(addToWishlist(userId, bookData?._id))
  }



  // const getPrice = (book) => {
  //   if (book?.appliedOffer?.isActive && book.formats.physical.offerPrice) {
  //     return book.formats.physical.offerPrice
  //   }
  //   return book?.formats.physical.price
  // }
  const getPrice = (book) => {
    if (book?.appliedOffer?.isActive) {
      const originalPrice = book.formats?.physical?.price
      const offerPrice = originalPrice - (originalPrice * (book.appliedOffer.discountValue / 100))
      return offerPrice
    }
    return book.formats.physical.price
  }

  const buyNow = () => {
    try {
      const cart = {}
      cart.totalAmount = getPrice(bookData) * parseInt(quantity)
      cart.quantity = quantity
      cart.items = [{
        productId: { ...bookData },
        offer: {},
        quantity: quantity
      }]
      navigate('/checkout', { state: { cart } })
    } catch (err) {
      toast.error(err?.response?.data.message)
    }
  }

  const handleRemoveReview = async (reviewId) => {
    try {
      await axiosBookInstance.delete(`/reviews/${reviewId}/remove`)
      toast.success("Remove Removed Successfully")
      setReviews((reviews) => {
        return reviews.filter((review) => {
          return review._id != reviewId
        })
      })
    } catch (error) {
      toast.error(error?.message)
    }
  }
  return (
    <>
      <section className="details section--lg">
        <div className="details__container container grid">
          <div className="details__group col-6">
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
                  src={images[i + 1]}
                  className="details__small-img"
                  onClick={() => { handleImageClick(i + 1) }}
                />
              })}

            </div>
          </div>

          <div className="details__group">
            <h3 className="details__title">{bookData?.title}</h3>
            <p className="details__brand">
              Author: <span>{bookData?.author}</span>
            </p>
            <div className="details__price ">
              <div className="flex">
                {renderProductPrice(bookData)}
                <span className="save__price">{bookData?.appliedOffer?.discountValue && `(${bookData?.appliedOffer?.discountValue}%)`}</span>
              </div>
              <div>
                <Stack spacing={1}>
                  <Rating name="half-rating-read" value={prodRating?.toFixed()} readOnly />
                </Stack>

              </div>
            </div>
            <p className="short__description">
              {bookData?.description}
            </p>
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

            <div className="details__action">
              <input type="number" className="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min={1}
                max={bookData?.formats?.physical?.stock} />
              <button onClick={handleAddToWishlist} className="details__action-btn"><i className="fi fi-rs-heart"></i></button>
              <button className="primary-btn" onClick={(e) => { handleAddToCart(bookData) }}>Add To Cart</button>
              <button className="primary-btn" onClick={buyNow}>Buy Now</button>


            </div>
          </div>
        </div>
      </section>

      <section className="details__tab container">
        <div className="detail__tabs">
          <span className={`detail__tab ${activeTab === "info" ? "active-tab" : ""}`} onClick={() => handleTabClick("info")}>Additional Info</span>
          <span className={`detail__tab ${activeTab === "reviews" ? "active-tab" : ""}`} onClick={() => handleTabClick("reviews")}>Reviews</span>
        </div>

        <div className="details__tabs-content">
          {activeTab === "info" && (
            <div className={`details__tab-content ${activeTab == 'info' && "active-tab"}`} id="info">
              <table className="info__table mb-4">
                <tbody>
                  <tr><th>Author</th><td> {bookData?.author}</td></tr>
                  <tr><th>Published Date</th><td>{bookData?.publicationDate}</td></tr>
                  <tr><th>Language</th><td>{bookData?.language}</td></tr>
                  <tr><th>Stock Status</th>
                    <th
                      className={`${bookData.stockStatus == "Stock Out" && "prod-stock-out"}
                     ${bookData.stockStatus == "Hurry Up" && 'prod-hurry-up'}
                     ${bookData.stockStatus == "In Stock" && 'prod-in-stock'}`
                      }
                    >{bookData?.stockStatus}</th>
                  </tr>
                  <tr><th>Stock </th><td>{bookData?.formats?.physical?.stock}</td></tr>
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === "reviews" && (
            <div className={`details__tab-content ${activeTab == 'reviews' && "active-tab"}`} id="reviews">
              <div className="reviews__container grid">
                {selectedImage && <Dialog open={true} onClose={() => setSelectedImage(null)} maxWidth="md">
                  <img
                    src={selectedImage}
                    alt="Popup"
                    style={{ width: "100%", height: "auto" }}
                  />
                </Dialog>
                }
                {
                  reviews.length > 0 ?
                    reviews.map((review) => {
                      return <div className="review__single d-flex justify-content-between">
                        <div>
                          <h2 className="review__title">
                            <CIcon icon={cilUser} className="me-1" />
                            {review.userId?.username}</h2>
                          <Stack spacing={1} className="mb-2">
                            <Rating name="half-rating-read" defaultValue={review.rating} readOnly size="small" />
                          </Stack>
                          {
                            review?.image?.secure_url &&
                            <img src={review?.image?.secure_url}
                              alt="Reviewer"
                              className="review-images"
                              onClick={() => setSelectedImage(review?.image?.secure_url)
                              } />
                          }


                          <p className="review__description">{review.reviewText}</p>
                          <span className="review__date">{new Date(review.createdAt).toLocaleString()}</span>
                        </div>
                        <div>
                          {
                            review?.userId?._id == userId && <span className="review-img-remove"
                              onClick={() => { handleRemoveReview(review._id) }}
                            >
                              <CIcon icon={cilTrash} className="me-2" />
                              Remove Your Review </span>
                          }
                        </div>
                      </div>
                    })

                    :
                    <h5 className="empty-msg">No Reviews Yet</h5>
                }

              </div>

              <div className="review__form">
                <h4 className="review__form-title">Add a review</h4>
                <div className="rate__product">
                  <Stack spacing={1}>
                    <Rating name="half-rating" value={rating}
                      precision={1}
                      onChange={(e) => {
                        setRating(e.target.value)
                      }} />
                  </Stack>
                </div>
                <form action="" className="form grid">
                  <textarea className="form__input textarea" placeholder="Write Comment"
                    value={reviewText}
                    onChange={(e) => { setReviewText(e.target.value) }}
                  ></textarea>
                  {!reviewImage ? <label htmlFor="review-img" className="review-img-label">
                    <CIcon icon={cilImagePlus} className="me-2" />
                    Add A Image For Your Review </label> :
                    <span className="review-img-remove"
                      onClick={() => setReviewImage(null)}
                    >
                      <CIcon icon={cilTrash} className="me-2" />
                      Remove Image </span>
                  }

                  <input
                    type="file"
                    id="review-img"
                    accept='.png, .jpg, .jpeg'
                    name="image"
                    hidden
                    onChange={(e) => { handleSetImage(e.target.files[0]) }}
                    placeholder="Image URL"
                  />
                  {reviewImage && (
                    <div className="image-preview mb-2">
                      <img
                        src={URL.createObjectURL(reviewImage)}
                        alt="Your Review"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                  <div className="form__btn">
                    <button className="primary-btn" onClick={submitReview}>Submit Review</button>
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
