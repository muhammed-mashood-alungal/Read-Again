import React from 'react';

const showcaseData = [
  {
    title: "Highly Recommended",
    products: [
      {
        imgSrc: "./assets/img/showcase-img-1.jpg",
        name: "Floral Print Casual Cotton Dress",
        newPrice: "$238.85",
        oldPrice: "$245.8"
      },
      {
        imgSrc: "./assets/img/showcase-img-2.jpg",
        name: "Ruffled Solid Long Sleeve Blouse",
        newPrice: "$238.85",
        oldPrice: "$245.8"
      },
      {
        imgSrc: "./assets/img/showcase-img-3.jpg",
        name: "Multi-Color Print V-neck T-shirt",
        newPrice: "$238.85",
        oldPrice: "$245.8"
      }
    ]
  },
  {
    title: "Staff picks",
    products: [
      {
        imgSrc: "./assets/img/showcase-img-4.jpg",
        name: "Fish Print Patched T-shirt",
        newPrice: "$238.85",
        oldPrice: "$245.8"
      },
      {
        imgSrc: "./assets/img/showcase-img-5.jpg",
        name: "Fintage Floral Print Dress",
        newPrice: "$238.85",
        oldPrice: "$245.8"
      },
      {
        imgSrc: "./assets/img/showcase-img-6.jpg",
        name: "Multi-Color Stripe Circle T-shirt",
        newPrice: "$238.85",
        oldPrice: "$245.8"
      }
    ]
  },
  {
    title: "Top Selling",
    products: [
      {
        imgSrc: "./assets/img/showcase-img-7.jpg",
        name: "Geometric Printed Long Sleeve Blouse",
        newPrice: "$238.85",
        oldPrice: "$245.8"
      },
      {
        imgSrc: "./assets/img/showcase-img-8.jpg",
        name: "Print Patchwork Maxi Dress",
        newPrice: "$238.85",
        oldPrice: "$245.8"
      },
      {
        imgSrc: "./assets/img/showcase-img-9.jpg",
        name: "Daisy Floral Print Straps Jumpsuit",
        newPrice: "$238.85",
        oldPrice: "$245.8"
      }
    ]
  }
];

const Showcase = () => (
  <section className="showcase section">
    <div className="showcase__container container grid">
      {showcaseData.map((section, index) => (
        <div className="showcase__wrapper" key={index}>
          <h3 className="section__title">{section.title}</h3>
          {section.products.map((product, idx) => (
            <div className="showcase__item" key={idx}>
              <a href="details.html" className="showcase__img-box">
                <img
                  src={product.imgSrc}
                  alt={product.name}
                  className="showcase__img"
                />
              </a>
              <div className="showcase__content">
                <button>
                  <h4 className="showcase__title">{product.name}</h4>
                </button>
                <div className="showcase__price flex">
                  <span className="new__price">{product.newPrice}</span>
                  <span className="old__price">{product.oldPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </section>
);

export default Showcase;
