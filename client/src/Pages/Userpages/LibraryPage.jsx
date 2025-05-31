import React, { Suspense, useEffect, useState } from 'react'
import Header from '../../Components/User/Header/Header'

import Footer from '../../Components/User/Footer/Footer'
import ProductFilter from '../../Components/User/ProductFilter/ProductFilter'
import { axiosBookInstance } from '../../redux/Constants/axiosConstants'
import ProductLoading from '../../Components/LoadingComponents/ProductsLoading'
function LibraryPage() {
  const [filteredBooks, setFilteredBooks] = useState([])
  const [filterQuery, setFilterQuery] = useState('')
  const [count, setCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading,setLoading]=useState(false)
  const limit = 8
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axiosBookInstance.get(`/list/filtered-books/${filterQuery}&limit=${limit}&page=${currentPage}`)
        let pages = Math.ceil(response?.data?.totalBooks / limit)
        setTotalPages(pages)
        
        setFilteredBooks(response.data.books)
      } catch (err) {
        console.log(err)
      }finally{
        setLoading(false)
      }
    }
    fetchProducts()

  }, [filterQuery, count, currentPage])

  const updateQuery = (query) => {
    setFilterQuery(query)
  }

  const onSearch = (name) => {
    if (name.trim()) {
      setFilteredBooks(books => {
        return books.filter((book) => {
          return book.title.includes(name)
        })
      })
    } else {
      setCount(count + 1)
    }
  }
  const ProductList = React.lazy(() => import('../../Components/User/ProductsList/ProductsList'))
  return (
    <>
      <Header />
      <ProductFilter onFilter={updateQuery} setSearchQuery={onSearch} setCurrentPage={setCurrentPage} />
      {
        loading && <ProductLoading/>
      }
      <Suspense fallback={<ProductLoading/>}>
      
        {
          (filteredBooks.length > 0 &&  !loading) ?
            <>
              <ProductList books={filteredBooks} title={''} />
              <div className="text-center">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </button>
                <span className='primary-badge ms-1 me-1'> Page {currentPage} of {totalPages} </span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            </> :
            <h3 className='empty-msg m-5'>No Products Found</h3>
        }
      </Suspense>
      <Footer />
    </>
  )
}

export default LibraryPage