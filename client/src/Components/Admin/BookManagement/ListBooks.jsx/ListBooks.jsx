import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'reactstrap';
import {axiosAdminInstance, axiosBookInstance, axiosUserInstance} from '../../../../redux/Constants/axiosConstants'
import { bookImages, categoryImages } from '../../../../redux/Constants/imagesDir';
import BookForm from '../BookForm/BookFrom';
import BookDetails from '../BookDetails/BookDetails';

const ListBooks = () => {
  const [allBooks, setAllbooks] = useState([]);
  const [bookDetails , setBookDetails] =useState({})
  const [err, setErr] = useState("")
  const [isChildUpdated, setIsChildUpdated] = useState(false);
  const [rightSide,setRightSide] = useState("create")
  const [currentPage,setCurrentPage]=useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit=10

  useEffect(() => {
   const fetchBooks =async()=>{
    console.log(currentPage,limit)
     const response = await axiosBookInstance.get(`/?page=${currentPage}&limit=${limit}`)
     console.log(response.data)
     let pages= Math.ceil(response?.data?.totalBooks/limit)
     setTotalPages(pages)
     setAllbooks(response?.data?.allBooks)
     console.log(response?.data?.allBooks)
    }
    fetchBooks()
  }, [currentPage]);

  const rightSideBar=()=>{
    if(rightSide === "create"){
      return <BookForm/>
    }
    if(rightSide === "details"){
      return <BookDetails book={bookDetails}/>  
    }
    if(rightSide === "update")
      return <BookForm bookDetails={bookDetails}/>
  }

  const viewBook = async(bookId)=>{
    console.log(bookId)
      await getBookData(bookId)
      setRightSide("details")
  }
  const updateBook = async(bookId)=>{
    await getBookData(bookId)
    console.log(bookId)
    setRightSide("update")
  }
  const handleBookDelete=async(bookId)=>{
    try{
       await axiosBookInstance.put(`/${bookId}/toggle-delete`)
       console.log(bookId)
       setAllbooks(books=>{
        return books.map((book)=>{
          return book._id == bookId ? {...book,isDeleted:!book.isDeleted} : book
        })
       })
    }catch(err){
      setErr(err?.response?.data?.message)
    }
  }

  const getBookData =async (bookId)=>{
    try{
      const response = await  axiosBookInstance.get(`/${bookId}`)
      console.log(response.data.bookData)
      setBookDetails(response.data.bookData)
      
    }catch(err){
      console.log(err)
    }
  }
 
  

  return (
    <Container className='content'>
    <Row className="category-management">
      <Col md={8}>
      <h4 className="title">Books Management</h4>
      {err && <p>{err}</p> }
      <div className="row p-3">
        <div className="col-12 grid-margin">
          <div className="card category-table">
            <div className="card-body">
              <h4 className="table-title">All Books</h4>
              <form className="nav-link mt-2 mt-md-0 d-lg-flex search">
                  <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="Search categories"
                  />
                  <button
                    className="primary-btn"
                  >
                    Search
                  </button>
                </form>
                <br />
              <div className="table-responsive">
                
                <table className="table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>View</th>
                      <th>Update</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBooks.map(book => (
                      <tr key={book._id}>
                        <td>
                          <img src={bookImages+book._id+"/"+book.images[0]}  alt="book-img" className="category-image" />
                          
                        </td>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.category}</td>
                        <td>
                          <div
                            className="badge badge-outline-success action-btn"
                            onClick={() => viewBook(book._id)}
                          >
                            View
                          </div>
                        </td>
                        <td>
                          <div
                            className="badge badge-outline-success action-btn"
                            onClick={() => updateBook(book._id)}
                          >
                            Update
                          </div>
                        </td>
                        <td>
                          <div
                            className="badge badge-outline-danger action-btn"
                            onClick={() => handleBookDelete(book._id)}
                          >
                            {book.isDeleted ?  "Recover" : "Delete"} 
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span> Page {currentPage} of {totalPages} </span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
            </div>
          </div>
        </div>
      </div>
      </Col>
    <Col md={4} >
    <div className='right-sidebar'>
     {rightSideBar()}
   </div>
    </Col>
    </Row>
    </Container>
  );
};

export default ListBooks;