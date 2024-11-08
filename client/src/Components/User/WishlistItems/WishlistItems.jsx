import React from 'react';
import { Container, Table, Button } from 'reactstrap';

const WishlistItems = () => {
  // Dummy data for wishlist items
  const wishlist = [
    {
      id: 1,
      image: './assets/img/product-2-1.jpg',
      name: "J.Crew Mercantile Women's Short-Sleeve",
      description: "Lorem ipsum dolor sit amet consectetur.",
      price: "$110",
      stockStatus: "In Stock"
    },
    {
      id: 2,
      image: './assets/img/product-1-2.jpg',
      name: "Amazon Essentials Women's Tank",
      description: "Lorem ipsum dolor sit amet consectetur.",
      price: "$110",
      stockStatus: "In Stock"
    },
    {
      id: 3,
      image: './assets/img/product-7-1.jpg',
      name: "Amazon Brand - Daily Ritual Women's Jersey",
      description: "Lorem ipsum dolor sit amet consectetur.",
      price: "$110",
      stockStatus: "In Stock"
    }
  ];

  return (
    <section className="wishlist section--lg">
      <Container>
        <div className="table__container">
          <Table responsive className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Action</th>
                <th>Rename</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img src={item.image} alt={item.name} className="table__img" />
                  </td>
                  <td>
                    <h3 className="table__title">{item.name}</h3>
                    <p className="table__description">{item.description}</p>
                  </td>
                  <td>
                    <span className="table__price">{item.price}</span>
                  </td>
                  <td>
                    <span className="table__stock">{item.stockStatus}</span>
                  </td>
                  <td>
                    <Button color="primary" size="sm" className="btn--sm">
                      Add to Cart
                    </Button>
                  </td>
                  <td>
                    <i className="fi fi-rs-trash table__trash" style={{ cursor: 'pointer' }}></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </section>
  );
};

export default WishlistItems;
