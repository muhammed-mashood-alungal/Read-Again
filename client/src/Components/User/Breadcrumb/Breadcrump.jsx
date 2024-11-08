import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = () => {
  return (
    <section className="breadcrumb">
      <ul className="breadcrumb__list flex container">
        <li>
          <Link to="/" className="breadcrumb__link">Home</Link>
        </li>
        <li>
          <span className="breadcrumb__link"> &gt; </span>
        </li>
        <li>
          <span className="breadcrumb__link">Login / Register</span>
        </li>
      </ul>
    </section>
  );
};

export default Breadcrumb;
