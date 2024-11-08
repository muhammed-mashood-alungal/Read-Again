import React, { useState } from 'react';
import './ProductFilter.css'
const ProductFilter = () => {
  const [activeFilters, setActiveFilters] = useState({
    sort: '',
    price: '',
    author: ''
  });

  const sortOptions = [
    'Default',
    'Popularity',
    'Average rating',
    'Newness',
    'Price: Low to High',
    'Price: High to Low'
  ];

  const priceRanges = [
    'All',
    '$0.00 - $50.00',
    '$50.00 - $100.00',
    '$100.00 - $150.00',
    '$150.00 - $200.00',
    '$200.00+'
  ];

  const authorTypes = [
    'Award Winner',
    'Highly recommended',
    'New Author'
  ];

  const topFilters = ['Genre', 'Format', 'Language', 'Age Group'];



  return (
    <div className="filter-container container">
      <div className="filter-header">
        <div className="top-filters">
          {topFilters.map(filter => (
            <button key={filter} className="chip">
              {filter}
            </button>
          ))}
        </div>
        <button className="trending-button">
          Trending
        </button>
      </div>

      <div className="filters-row">
        <div className="filter-section">
          <h3>Sort By</h3>
          <div className="options-list">
            {sortOptions.map(option => (
              <label key={option} className="option-item">
                <input
                  type="radio"
                  name="sort"
                  value={option}
                  checked={activeFilters.sort === option}
                  onChange={(e) => setActiveFilters({...activeFilters, sort: e.target.value})}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Price</h3>
          <div className="options-list">
            {priceRanges.map(range => (
              <label key={range} className="option-item">
                <input
                  type="radio"
                  name="price"
                  value={range}
                  checked={activeFilters.price === range}
                  onChange={(e) => setActiveFilters({...activeFilters, price: e.target.value})}
                />
                {range}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Author</h3>
          <div className="options-list">
            {authorTypes.map(type => (
              <label key={type} className="option-item">
                <input
                  type="radio"
                  name="author"
                  value={type}
                  checked={activeFilters.author === type}
                  onChange={(e) => setActiveFilters({...activeFilters, author: e.target.value})}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;