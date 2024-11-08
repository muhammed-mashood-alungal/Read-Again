import React from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Input,
  Form,
  FormGroup,
} from 'reactstrap';

const ShoppingCart = () => {
  return (
    <section className="section--lg">
      <Container>
        {/* Cart Table */}
        <div className="table__container">
          <Table responsive className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={`./assets/img/product-${index + 1}-1.jpg`}
                      alt="Product"
                      className="table__img"
                    />
                  </td>
                  <td>
                    <h3 className="table__title">Product Title {index + 1}</h3>
                    <p className="table__description">
                      Lorem ipsum dolor sit amet consectetur.
                    </p>
                  </td>
                  <td>
                    <span className="table__price">$110</span>
                  </td>
                  <td>
                    <input type="number" value={3} className="quantity" />
                  </td>
                  <td>
                    <span className="subtotal">$220</span>
                  </td>
                  <td>
                    <i className="fi fi-rs-trash table__trash"></i>
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

export default ShoppingCart;
