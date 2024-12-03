import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'

const Sidebar = () => {
  return (
    <nav className="sidebar sidebar-offcanvas mt-4" id="sidebar">
      <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
        <Link className="sidebar-brand brand-logo" to="/admin/dashboard">Read Again</Link>
        <Link className="sidebar-brand brand-logo-mini" to="/admin/dashboard">
          <img src="assets/images/logo-mini.svg" alt="logo" />
        </Link>
      </div>
      <ul className="nav">
        <li className="nav-item menu-items">
          <Link className="nav-link" to="/admin/dashboard">
            <span className="menu-title">Dashboard</span>
          </Link>
        </li>
        <li className="nav-item menu-items">
        <Link className="nav-link" to="/admin/users">
            <span className="menu-title">User Managment</span>
        </Link>
        </li>
        <li className="nav-item menu-items">
        <Link className="nav-link" to="/admin/books">
            <span className="menu-title">Books Management</span>
        </Link>
        </li>
        <li className="nav-item menu-items">
        <Link className="nav-link" to="/admin/category">
            <span className="menu-title">Category Managment</span>
        </Link>
        </li>
        <li className="nav-item menu-items">
        <Link className="nav-link" to="/admin/orders">
            <span className="menu-title">Order Managment</span>
        </Link>
        </li>
       
      </ul>
    </nav>
  );
};

export default Sidebar;
