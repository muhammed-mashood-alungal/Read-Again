import React from 'react';
import { Container, Row, Col, Form, FormGroup, Input, Button, Table } from 'reactstrap';
import './CartActions.css'
const CartActions = () => {
  return (
    <section>
      <Container>
        {/* Divider */}
        <div className="divider text-center my-4">
          <i className="fi fi-rs-fingerprint"></i>
        </div>

        {/* Cart Group */}
        <Row className="cart__group">
          {/* Shipping and Coupon Section */}
          <Col md={6} className="mb-4">
            <div className="cart__shipping">
              <h3 className="section__title">Calculate Shipping</h3>
              <Form className="form">
                <FormGroup>
                  <input type="text" className="form__input" placeholder="State / Country" />
                </FormGroup>
                <FormGroup row>
                  <Col>
                    <input type="text" className="form__input" placeholder="City" />
                  </Col>
                  <Col>
                    <input type="text" className="form__input" placeholder="PostCode" />
                  </Col>
                </FormGroup>
                <div className="form__btn">
                  <button className="btn--sm">
                    <i className="fi fi-rs-shuffle"></i> Update
                  </button>
                </div>
              </Form>
            </div>

            <div className="cart__coupon mt-4">
              <h3 className="section__title">Apply Coupon</h3>
              <Form className="coupon__form form">
                <FormGroup row>
                  <Col>
                    <input type="text" className="form__input" placeholder="Enter Your Coupon" />
                  </Col>
                  <div className="form__btn">
                    <button className="btn--sm">
                      <i className="fi fi-rs-label"></i> Apply
                    </button>
                  </div>
                </FormGroup>
              </Form>
            </div>
          </Col>

          {/* Cart Totals Section */}
          <Col md={6}>
            <div className="cart__total">
              <h3 className="section__title">Cart Totals</h3>
              <div className="table-responsive">
                <Table borderless className="cart__total-table">
                  <tbody>
                    <tr>
                      <td><span className="cart__total-title">Cart Subtotal</span></td>
                      <td><span className="cart__total-price">₹240.00</span></td>
                    </tr>
                    <tr>
                      <td><span className="cart__total-title">Shipping</span></td>
                      <td><span className="cart__total-price">₹10.00</span></td>
                    </tr>
                    <tr>
                      <td><span className="cart__total-title">Total</span></td>
                      <td><span className="cart__total-price">₹250.00</span></td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <Button color="success" className="btn--md">
                <i className="fi fi-rs-box-alt"></i> Proceed To Checkout
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CartActions;
