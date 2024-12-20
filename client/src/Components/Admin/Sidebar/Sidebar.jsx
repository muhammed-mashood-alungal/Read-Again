import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'
import {
  CSidebar,
  CSidebarNav,
  CNavItem,
  CSidebarBrand,
  CSidebarHeader,
  CNavTitle,
  CBadge,
  CNavGroup,
  CSidebarToggler
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilSpeedometer, cilUser, cilLibrary, cilList, cilCart, cilPuzzle, cilMenu, cilTags, cilGift } from '@coreui/icons';
const Sidebar = () => {
  const [visible, setVisible] = useState(true);
  return (
    <>
    <button 
    style={{zIndex:'10000'}}
      className="d-lg-none btn btn-link position-fixed top-0 start-0 m-2 " 
      onClick={() => setVisible(!visible)}
    >
      <CIcon icon={cilMenu} size="lg" />
    </button>

    <CSidebar 
      colorScheme="dark"
      className="border-end overflow-hidden" 
      visible={visible}
      onVisibleChange={(val) => setVisible(val)}
      responsive
      unfoldable
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand>
        </CSidebarBrand>
      </CSidebarHeader>
      
      <CSidebarNav>
        <CNavTitle>Navigation</CNavTitle>
        <CNavItem href="/admin/dashboard">
          <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
          Dashboard
        </CNavItem>
        <CNavItem href="/admin/users">
          <CIcon customClassName="nav-icon" icon={cilUser} />
          User Management
        </CNavItem>
        <CNavItem href="/admin/books">
          <CIcon customClassName="nav-icon" icon={cilLibrary} />
          Books Management
        </CNavItem>
        <CNavItem href="/admin/category">
          <CIcon customClassName="nav-icon" icon={cilList} />
          Category Management
        </CNavItem>
        <CNavItem href="/admin/orders">
          <CIcon customClassName="nav-icon" icon={cilCart} />
          Order Management
        </CNavItem>
        <CNavItem href="/admin/coupons">
          <CIcon customClassName="nav-icon" icon={cilTags} />
          Coupon Management
        </CNavItem>
        <CNavItem href="/admin/offers">
          <CIcon customClassName="nav-icon" icon={cilGift} />
          Offer Management
        </CNavItem>
      </CSidebarNav>

      {/* Optional: Sidebar Toggler for Desktop */}
      <CSidebarToggler 
        className="d-none d-md-flex"
        onClick={() => setVisible(!visible)} 
      />
    </CSidebar>
  </>
  );
  
  
};

export default Sidebar;
