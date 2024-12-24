import React from 'react';
import CIcon from '@coreui/icons-react';
import { cibFacebook, cibInstagram, cibTwitter, cibYoutube } from '@coreui/icons';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const Footer = () => {
  const {isLoggedIn} = useSelector(state=>state.auth)
  return (
    <footer className=" container">
      <div className="footer__container grid">

        <div className="footer__content">
          <a href="index.html" className="footer__logo">
            <img src="/assets/img/logo.jpg" alt="Logo" className="footer__logo-img" />
          </a>
          <h4 className="footer__subtitle">Contact</h4>
          <p className="footer__description">
            <span>Address:</span> Kozhikod , Kerala , India
          </p>
          <p className="footer__description">
            <span>Phone:</span> +91 1212121212
          </p>
          
          {/* Social Links */}
          <div className="footer__social">
            <h4 className="footer__subtitle">Follow Me</h4>
            <div className="footer__links flex">
              <CIcon icon={cibInstagram} size="lg" />
              <CIcon icon={cibFacebook} size="lg" />
              <CIcon icon={cibTwitter} size="lg" />
              <CIcon icon={cibYoutube} size="lg"/> 
              </div>
          </div>
        </div>

        {/* Address Links Section */}
        <div className="footer__content">
          <h3 className="footer__title">Address</h3>
          <ul className="footer__links">
            <li><a href="#" className="footer__link">About Us</a></li>
            <li><a href="#" className="footer__link">Delivery Information</a></li>
            <li><a href="#" className="footer__link">Privacy Policy</a></li>
            <li><a href="#" className="footer__link">Terms & Conditions</a></li>
            <li><a href="#" className="footer__link">Contact Us</a></li>
            <li><a href="#" className="footer__link">Support Center</a></li>
          </ul>
        </div>

        {/* Account Links Section */}
        <div className="footer__content">
          <h3 className="footer__title">My Account</h3>
          <ul className="footer__links">
            {
              !isLoggedIn &&  <li><a href="#" className="footer__link">Sign In</a></li>
            }
           
            <li><Link to="/cart" className="footer__link">View Cart</Link></li>
            <li><Link to="/wishlist" className="footer__link">My Wishlist</Link></li>
            <li><Link to="/account?tab=wallet" className="footer__link">Wallet</Link></li>
            <li><Link to="/account?tab=orders" className="footer__link">Order</Link></li>
          </ul>
        </div>

        {/* Payment Section */}
        <div className="footer__content">
          <h3 className="footer__title">Secured Payed Gateways</h3>
          <img src="/assets/img/payment-method.png" alt="Payment Methods" className="payment__img" />
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer__bottom">
        <p className="copyright">&copy; 2024 Read Again.</p>
      </div>
    </footer>
  );
};

export default Footer;
