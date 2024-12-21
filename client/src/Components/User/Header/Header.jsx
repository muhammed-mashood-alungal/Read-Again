import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getUserData, removeAuth, setCartItemsCount, setWishlistItemsCount } from '../../../redux/Actions/userActions';
import { axiosAuthInstance, axiosBookInstance, axiosCartInstance, axiosUserInstance, axiosWishlistInstance } from '../../../redux/Constants/axiosConstants';
import { toast } from 'react-toastify';
import { CListGroup, CListGroupItem } from '@coreui/react';
import { bookImages } from '../../../redux/Constants/imagesDir';

import './Header.css'
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  Input,
  ListGroup,
  ListGroupItem,
  Badge,
  Container
} from 'reactstrap';

const Header = ({ setSearchQuery }) => {
  // Keep all your existing state and hooks
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, userId } = useSelector(state => state.auth);
  const { cartCount } = useSelector(state => state.cartItemsCount);
  const { wishlistCount } = useSelector(state => state.wishlistCount);
  const [activeTab, setActiveTab] = useState("Home");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [searchedProduct, setSearchedProduct] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

    useEffect(() => {
    async function fetchCartAndWishlistCount() {
      try {
        const [cartResponse,wishlistResponse]=await Promise.all([
           axiosCartInstance.get(`/${userId}/cart-items-count`),
           axiosWishlistInstance.get(`/${userId}/wishlist-items-count`)
        ])
        dispatch(setCartItemsCount(cartResponse?.data?.cartItemsCount))
        dispatch(setWishlistItemsCount(wishlistResponse?.data?.totalItems))
      } catch (err) {
        console.log(err)
        //toast.error(err?.response?.data?.message)
      }
    }
    
    if (userId) {
      fetchCartAndWishlistCount()
    }

  }, [dispatch, userId])

  const handleLogOut = async () => {
    try {
      const response = await axiosAuthInstance.get('/logout');
      dispatch(removeAuth());
    } catch (error) {
      console.error("Logout failed", error.response?.data || error.message);
    }
  }
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab("Home");
    else if (path === '/library') setActiveTab("Library");
    else if (path === '/account') setActiveTab("Account");
    else if (path === '/register') setActiveTab("SignUp");
    else if (path === '/login') setActiveTab("Login");
  }, [location.pathname]);

  const searchForProducts = async (e) => {
    try {
        const value = e.target.value
        setSearchedProduct(value)
        const { data } = await axiosBookInstance.get(`/search/?title=${value}`)
        setSearchedProducts(data.products)
    } catch (err) {
        console.log(err)
        toast.error("Something Went Wrong")
    }
}

  return (
    <header className="header">
      <Navbar expand="md" className="nav container" light>
        <NavbarBrand href="/" className="nav__logo">
          <img
            className="nav__logo-img"
            src="/assets/img/logo.jpg"
            alt="website logo"
          />
        </NavbarBrand>
        
        <NavbarToggler onClick={() => setMenuOpen(!isMenuOpen)} />
        
        <Collapse isOpen={isMenuOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <Link 
                to={'/'}
                className={`nav-link ${activeTab === "Home" ? "active-link" : ""}`}
                onClick={() => setActiveTab("Home")}
              >
                Home
              </Link>
            </NavItem>
            
            <NavItem>
              <Link 
                to={'/library'}
                className={`nav-link ${activeTab === "Library" ? "active-link" : ""}`}
                onClick={() => setActiveTab("Library")}
              >
                Library
              </Link>
            </NavItem>
            
            {isLoggedIn && (
              <NavItem>
                <Link 
                  to='/account'
                  className={`nav-link ${activeTab === "Account" ? "active-link" : ""}`}
                  onClick={() => setActiveTab("Account")}
                >
                  Account
                </Link>
              </NavItem>
            )}
            
            {!isLoggedIn && (
              <>
                <NavItem>
                  <Link 
                    to='/register'
                    className={`nav-link ${activeTab === "SignUp" ? "active-link" : ""}`}
                    onClick={() => setActiveTab("SignUp")}
                  >
                    Sign up
                  </Link>
                </NavItem>
                <NavItem>
                  <Link 
                    to='/login'
                    className={`nav-link ${activeTab === "Login" ? "active-link" : ""}`}
                    onClick={() => setActiveTab("Login")}
                  >
                    Log In
                  </Link>
                </NavItem>
              </>
            )}
            
            {isLoggedIn && (
              <NavItem>
                <Link 
                  onClick={handleLogOut}
                  className="nav-link"
                >
                  Log Out
                </Link>
              </NavItem>
            )}
          </Nav>
          
          <div className="header__search position-relative mb-3 mb-md-0">
            <Input
              type="text"
              value={searchedProduct}
              onChange={searchForProducts}
              placeholder="Search For Items..."
              className="form__input"
            />
            {searchedProducts.length > 0 && (
              <ListGroup className='position-absolute w-100 search-results'>
                {searchedProducts.map((product) => (
                  <ListGroupItem
                    key={product._id}
                    action
                    onClick={() => navigate(`/book-details/${product._id}`)}
                    className="d-flex align-items-center"
                  >
                    <img 
                      src={product.images[0].secure_url}
                      alt="book-img" 
                      className="me-2"
                      style={{width: '30px'}}
                    />
                    {product.title}
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </div>
          
          <div className="header__user-actions d-flex align-items-center mt-3 mt-md-0">
            <Link to={"/wishlist"} className="header__action-btn ms-2" title="Wishlist">
              <img src="/assets/img/icon-heart.svg" alt="Wishlist" />
              <span className="count">{wishlistCount}</span>
            </Link>
            <Link to={"/cart"} className="header__action-btn" title="Cart">
              <img src="/assets/img/icon-cart.svg" alt="Cart" />
              <span className="count">{cartCount}</span>
            </Link>
          </div>
        </Collapse>
      </Navbar>
    </header>
  );
};

export default Header;