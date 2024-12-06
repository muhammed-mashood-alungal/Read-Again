import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, useLocation} from 'react-router-dom'
import { getUserData, removeAuth, setCartItemsCount } from '../../../redux/Actions/userActions';
import { axiosAuthInstance, axiosCartInstance, axiosUserInstance } from '../../../redux/Constants/axiosConstants';
import { toast } from 'react-toastify';
const Header = ({setSearchQuery}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const {isLoggedIn,userId} = useSelector(state=>state.auth)
  const {cartCount} = useSelector(state=>state.cartItemsCount)
  const [activeTab ,setActiveTab]=useState("Home")
  const [search ,setSearch]=useState("")
  const dispatch = useDispatch()
  const location = useLocation()
  useEffect(()=>{
    async function fetchCartItemsCount(){
   try{
    const {data} = await axiosCartInstance.get(`/${userId}/cart-items-count`)
    console.log(data)
    dispatch(setCartItemsCount(data.cartItemsCount))
   }catch(err){
    console.log(err)
     toast.error(err?.response?.data?.message)
   }
   }
   if(userId){
    fetchCartItemsCount()
   }
  
  },[dispatch,userId])

 const handleLogOut=async()=>{
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

 
 return (
    <header className="header">
  

      <nav className="nav container">
        <a href="index.html" className="nav__logo">
          <img
            className="nav__logo-img"
            src="/assets/img/logo.svg"
            alt="website logo"
          />
        </a>
        <div className={`nav__menu ${isMenuOpen ? 'open' : ''}`} id="nav-menu">
          <div className="nav__menu-top">
            <a href="" className="nav__menu-logo ">
              <img src="/assets/img/logo.svg" alt="Logo" />
            </a>
            <div className="nav__close" id="nav-close" >
              <i className="fi fi-rs-cross-small"></i>
            </div>
          </div>
          <ul className="nav__list">
            <li className="nav__item">
              <Link to={'/'} className={`nav__link no-underline ${activeTab == "Home" && "active-link"}`}
                onClick={()=>setActiveTab("Home")}>
                Home
              </Link>  
            </li>
            <li className="nav__item">
              <Link to={'/library'} className={`nav__link no-underline ${activeTab == "Library" && "active-link"}`}
                onClick={()=>setActiveTab("Library")}>
                Library
              </Link>
            </li>
            { isLoggedIn && <li className="nav__item">
                <Link to='/account' className={`nav__link no-underline ${activeTab == "Account" && "active-link"}`}
                 onClick={()=>setActiveTab("Account")}>
                 Account
                </Link>
                </li>}
              { !isLoggedIn && <li className="nav__item">
                <Link to='/register' className={`nav__link no-underline ${activeTab == "SignUp" && "active-link"}`}
                 onClick={()=>setActiveTab("SignUp")}>
                Sign up
                </Link>
                </li>}
                {!isLoggedIn && <li className="nav__item">
                <Link to='/login' className={`nav__link no-underline ${activeTab == "Login" && "active-link"}`}
                onClick={()=>setActiveTab("Login")}>
                Log In 
                </Link>
                </li>}
              {
                isLoggedIn && <li className="nav__item">
                <Link onClick={handleLogOut} className="nav__link no-underline">
                Log Out
                </Link>
                </li>
              }
              
          </ul>
          <div className="header__search">
            <input
              type="text"
              value={search}
              onChange={(e)=>{setSearch(e.target.value)}}
              placeholder="Search For Items..."
              className="form__input"
            />
            <button className="search__btn">
              <img src="/assets/img/search.png" alt="search icon" />
            </button>
          </div>
        </div>
        <div className="header__user-actions">
          <a href="wishlist.html" className="header__action-btn" title="Wishlist">
            <img src="/assets/img/icon-heart.svg" alt="Wishlist" />
            {/* <span className="count">3</span> */}
          </a>
          <Link to={"/cart"} className="header__action-btn" title="Cart">
            <img src="/assets/img/icon-cart.svg" alt="Cart" />
            <span className="count">{cartCount}</span>
          </Link>
          <div className="header__action-btn nav__toggle" id="nav-toggle" >
            <img src="/assets/img/menu-burger.svg" alt="Menu" />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
