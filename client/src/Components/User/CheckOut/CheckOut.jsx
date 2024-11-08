import React from 'react';
import { Button, Form, Table } from 'reactstrap';

const Checkout = () => {
  return (
    <section className="checkout section--lg">
      <div className="checkout__container container grid">
        <div className="checkout__group">
          <h3 className="section__title">Billing Details</h3>
          <form className="form grid">
            <input type="text" placeholder="Name" className="form__input" />
            <input type="text" placeholder="Address" className="form__input" />
            <input type="text" placeholder="City" className="form__input" />
            <input type="text" placeholder="Country" className="form__input" />
            <input type="text" placeholder="Postcode" className="form__input" />
            <input type="text" placeholder="Phone" className="form__input" />
            <input type="email" placeholder="Email" className="form__input" />
            <h3 className="checkout__title">Additional Information</h3>
            <textarea
              placeholder="Order note"
              className="form__input textarea"
            ></textarea>
          </form>
        </div>

        <div className="checkout__group">
          <h3 className="section__title">Cart Totals</h3>
          <Table className="order__table">
            <thead>
              <tr>
                <th colSpan="2">Products</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img
                    src="./assets/img/product-1-2.jpg"
                    alt=""
                    className="order__img"
                  />
                </td>
                <td>
                  <h3 className="table__title">Yidarton Women Summer Blue</h3>
                  <p className="table__quantity">x 2</p>
                </td>
                <td><span className="table__price">$180.00</span></td>
              </tr>
              <tr>
                <td>
                  <img
                    src="./assets/img/product-2-1.jpg"
                    alt=""
                    className="order__img"
                  />
                </td>
                <td>
                  <h3 className="table__title">LDB Moon Summer</h3>
                  <p className="table__quantity">x 1</p>
                </td>
                <td><span className="table__price">$65.00</span></td>
              </tr>
              <tr>
                <td>
                  <img
                    src="./assets/img/product-7-1.jpg"
                    alt=""
                    className="order__img"
                  />
                </td>
                <td>
                  <h3 className="table__title">Women Short Sleeve Loose</h3>
                  <p className="table__quantity">x 2</p>
                </td>
                <td><span className="table__price">$35.00</span></td>
              </tr>
              <tr>
                <td><span className="order__subtitle">Subtotal</span></td>
                <td colSpan="2"><span className="table__price">$280.00</span></td>
              </tr>
              <tr>
                <td><span className="order__subtitle">Shipping</span></td>
                <td colSpan="2">
                  <span className="table__price">Free Shipping</span>
                </td>
              </tr>
              <tr>
                <td><span className="order__subtitle">Total</span></td>
                <td colSpan="2">
                  <span className="order__grand-total">$280.00</span>
                </td>
              </tr>
            </tbody>
          </Table>

          <div className="payment__methods">
            <h3 className="checkout__title payment__title">Payment</h3>
            <div className="payment__option flex">
              <input
                type="radio"
                name="paymentMethod"
                id="bankTransfer"
                defaultChecked
                className="payment__input"
              />
              <label htmlFor="bankTransfer" className="payment__label">
                Direct Bank Transfer
              </label>
            </div>
            <div className="payment__option flex">
              <input
                type="radio"
                name="paymentMethod"
                id="checkPayment"
                className="payment__input"
              />
              <label htmlFor="checkPayment" className="payment__label">
                Check Payment
              </label>
            </div>
            <div className="payment__option flex">
              <input
                type="radio"
                name="paymentMethod"
                id="paypal"
                className="payment__input"
              />
              <label htmlFor="paypal" className="payment__label">
                Paypal
              </label>
            </div>
          </div>
          <Button className="btn btn--md">Place Order</Button>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
