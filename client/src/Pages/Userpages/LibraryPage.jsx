import React, { useEffect, useState } from 'react'
import Header from '../../Components/User/Header/Header'
import ProductList from '../../Components/User/ProductsList/ProductsList'
import Footer from '../../Components/User/Footer/Footer'
import ProductFilter from '../../Components/User/ProductFilter/ProductFilter'
import Breadcrumbs from '../../Components/User/Breadcrumb/Breadcrump'
import { axiosBookInstance } from '../../redux/Constants/axiosConstants'
function LibraryPage() {
  const [justPublished, setJustPublished] = useState([])
  const [filterQuery, setFilterQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState("")
  const [count, setCount] = useState(0)
  const [currentPage,setCurrentPage]=useState(1)
  const [totalPages ,setTotalPages]=useState(0)
  const limit=8
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosBookInstance.get(`/list/filtered-books/${filterQuery}&limit=${limit}&page=${currentPage}`)
        console.log(response.data.books)
        let pages= Math.ceil(response?.data?.totalBooks/limit)
        setTotalPages(pages)
        setJustPublished(response.data.books)
      } catch (err) {
        console.log(err)
      }
    }
    fetchProducts()

  }, [filterQuery, count ,currentPage])

  const updateQuery = (query) => {
    setFilterQuery(query)
  }

  const onSearch = (name) => {
    if (name.trim()) {
      setJustPublished(books => {
        return books.filter((book) => {
          return book.title.includes(name)
        })
      })
    } else {
      setCount(count + 1)
    }

  }
  return (
    <>
      <Header />
      {/* <Breadcrumbs/> */}
      <ProductFilter onFilter={updateQuery} setSearchQuery={onSearch} />
      <ProductList books={justPublished} title={''} />
      <div className="text-center">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span className='primary-badge ms-1 me-1'> Page {currentPage} of {totalPages} </span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <Footer />
    </>
  )
}

export default LibraryPage