import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

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
          <a href="login-register.html" className="header__top-action">
            Log In / Sign Up
          </a>
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
            <div className="nav__close" id="nav-close" onClick={toggleMenu}>
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
            <li className="nav__item">
              <a href="compare.html" className="nav__link">
                Compare
              </a>
            </li>
            <li className="nav__item">
              <a href="login-register.html" className="nav__link">
                Login
              </a>
            </li>
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
          <div className="header__action-btn nav__toggle" id="nav-toggle" onClick={toggleMenu}>
            <img src="./assets/img/menu-burger.svg" alt="Menu" />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
