import React, { useEffect, useState } from 'react';
import './ProductFilter.css'
import { toast } from 'react-toastify';
import { axiosCategoryInstance } from '../../../redux/Constants/axiosConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { useSearchParams } from 'react-router-dom';


const ProductFilter = ({ onFilter, setSearchQuery }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const queryCategory = searchParams.get('category')

  useEffect(() => {
    if (queryCategory) {
      setActiveFilters({ ...activeFilters, category: queryCategory })
    }
  }, [])

  const [activeFilters, setActiveFilters] = useState({
    sort: 'Default',
    price: {},
    category: 'All'
  });
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axiosCategoryInstance.get('/listed')
        if (response.status == 200) {
          setCategories([{ name: "All" }, ...response.data.categories])
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Something Went Wrong")
      }
    }
    fetchCategories()
  }, [])


  useEffect(() => {
    onFilter(`?sortBy=${activeFilters.sort}&price=${JSON.stringify(activeFilters.price)}&category=${activeFilters.category}`)
  }, [activeFilters])
  useEffect(() => {
    setSearchQuery(search)
  }, [search])

  const sortOptions = [
    'Default',
    'Average rating',
    'Newness',
    'Price: Low to High',
    'Price: High to Low',
    'A-Z',
    'Z-A'
  ];

  const priceRanges = [
    ['All', {}],
    ['₹0.00 - ₹100.00', { $lt: 100 }],
    ['₹100.00 - ₹250.00', { $gt: 100, $lt: 250 }],
    ['₹250.00 - ₹500.00', { $gt: 250, $lt: 500 }],
    ['₹500.00 - ₹1000.00', { $gt: 500, $lt: 1000 }],
    ['₹1000.00+', { $gt: 1000 }]
  ];



  return (

    <div className="filter-container container mt-3">
      {
        <button onClick={() => { setIsOpen(!isOpen) }} className="chip">
          <FontAwesomeIcon icon={faFilter} />  Filter {
            isOpen ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />
          }
        </button>
      }
      {
        isOpen &&

        <>
          <div className="filter-header">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value) }}
              placeholder="Search For Items..."
              className="form__input mt-3"
            />
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
                      onChange={(e) => setActiveFilters({ ...activeFilters, sort: e.target.value })}
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
                  <label key={range[0]} className="option-item">
                    <input
                      type="radio"
                      name="price"
                      value={JSON.stringify(range[1])}
                      checked={JSON.stringify(activeFilters.price) === JSON.stringify(range[1])}
                      onChange={(e) =>
                        setActiveFilters({
                          ...activeFilters,
                          price: JSON.parse(e.target.value)
                        })
                      }
                    />
                    {range[0]}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Catogory</h3>
              <div className="options-list">
                {categories?.map(category => (
                  <label key={category.name} className="option-item">
                    <input
                      type="radio"
                      name="author"
                      value={category.name}
                      checked={activeFilters.category === category.name}
                      onChange={(e) => setActiveFilters({ ...activeFilters, category: e.target.value })}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default ProductFilter;