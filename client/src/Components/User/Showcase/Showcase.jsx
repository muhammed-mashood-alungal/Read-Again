import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



const Showcase = ({data}) => {
  const [showcaseData,setShowCaseData]=useState([])
  const navigate = useNavigate()
  useEffect(()=>{
    setShowCaseData(data)
  })

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
 return (
   <section className="showcase section">
    <div className="showcase__container container grid">
      {showcaseData?.map((section, index) => (
        <div className="showcase__wrapper" key={index}>
          <h4 className="">{section.title}</h4>
          <hr />
          {section?.products?.map((product, idx) => (
           
            <div className="showcase__item" key={idx} onClick={()=>{navigate(`/book-details/${product._id}`)}}>
              <a  className="showcase__img-box">
                <img
                  src={product?.images[0].secure_url}
                  alt={product.name}
                  className="showcase__img"
                />
              </a>
              <div className="showcase__content">
                <button>
                  <h4 className="showcase__title">{product.title}</h4>
                </button>
                <div className="showcase__price flex">
                  {renderProductPrice(product)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </section>
  )
};

export default Showcase;
