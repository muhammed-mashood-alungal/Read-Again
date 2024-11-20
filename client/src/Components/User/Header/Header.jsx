import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom'
import { getUserData } from '../../../redux/Actions/userActions';
import { axiosUserInstance } from '../../../redux/Constants/axiosConstants';
const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn,setIsLoggedIn] = useState(false)
 
  

  return (
    <header className="header">
      <div className="header__top">
        <div className="header__container container">
          <div className="header__contact">
            <span>(+01) - 2345 - 6789</span>
            <span>Our location</span>
          </div>
          <p className="header__alert-news">
            Super Values Deals - Save more coupons
          </p>
          <Link to='/login' className="header__top-action">
            Log In / Sign Up
          </Link>
        </div>
      </div>

      <nav className="nav container">
        <a href="index.html" className="nav__logo">
          <img
            className="nav__logo-img"
            src="assets/img/logo.svg"
            alt="website logo"
          />
        </a>
        <div className={`nav__menu ${isMenuOpen ? 'open' : ''}`} id="nav-menu">
          <div className="nav__menu-top">
            <a href="index.html" className="nav__menu-logo">
              <img src="./assets/img/logo.svg" alt="Logo" />
            </a>
            <div className="nav__close" id="nav-close" >
              <i className="fi fi-rs-cross-small"></i>
            </div>
          </div>
          <ul className="nav__list">
            <li className="nav__item">
              <a href="index.html" className="nav__link active-link">
                Home
              </a>
            </li>
            <li className="nav__item">
              <a href="shop.html" className="nav__link">
                Shop
              </a>
            </li>
            <li className="nav__item">
              <a href="accounts.html" className="nav__link">
                My Account
              </a>
              </li>

              {
                !isLoggedIn ?  
                <div>
                <li className="nav__item">
                <Link to='/register' className="nav__link no-underline">
                Sign up
                </Link>
                </li>
                <li className="nav__item">
                <Link to='/login' className="nav__link no-underline">
                Log In 
                </Link>
                </li>
                </div>
               
                : <li className="nav__item">
                <Link to='/login' className="nav__link no-underline">
                Log Out
                </Link>
                </li>
              }
              
          </ul>
          <div className="header__search">
            <input
              type="text"
              placeholder="Search For Items..."
              className="form__input"
            />
            <button className="search__btn">
              <img src="assets/img/search.png" alt="search icon" />
            </button>
          </div>
        </div>
        <div className="header__user-actions">
          <a href="wishlist.html" className="header__action-btn" title="Wishlist">
            <img src="assets/img/icon-heart.svg" alt="Wishlist" />
            <span className="count">3</span>
          </a>
          <a href="cart.html" className="header__action-btn" title="Cart">
            <img src="assets/img/icon-cart.svg" alt="Cart" />
            <span className="count">3</span>
          </a>
          <div className="header__action-btn nav__toggle" id="nav-toggle" >
            <img src="./assets/img/menu-burger.svg" alt="Menu" />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
