import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { axiosBookInstance, } from '../../../../redux/Constants/axiosConstants'
import ConfirmationModal from '../../../CommonComponents/ConfirmationModal/ConfirmationModal';
import { CButton, CTable } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ListBooks = () => {
  const [allBooks, setAllbooks] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedBookId, setSelectedBookId] = useState(null)
  const limit = 10
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axiosBookInstance.get(`/?page=${currentPage}&limit=${limit}`)
      let pages = Math.ceil(response?.data?.totalBooks / limit)
      setTotalPages(pages)
      setAllbooks(response?.data?.allBooks)
    }
    fetchBooks()
  }, [currentPage]);



  const handleBookSearch = async (e) => {
    try {
      const name = e.target.value
      const response = await axiosBookInstance.get(`/?page=${currentPage}&limit=${limit}&name=${name}`)
      let pages = Math.ceil(response?.data?.totalBooks / limit)
      setTotalPages(pages)
      setAllbooks(response?.data?.allBooks)
    } catch (err) {
      toast.error("Something went Wrong While Searching")
    }
  }

  const handleBookDelete = async () => {
    try {
      await axiosBookInstance.put(`/${selectedBookId}/toggle-delete`)
      setAllbooks(books => {
        return books.map((book) => {
          return book._id == selectedBookId ? { ...book, isDeleted: !book.isDeleted } : book
        })
      })
    } catch (err) {
      toast.error(err?.response?.data?.message)
    } finally {
      setSelectedBookId(null)
    }
  }


  const confirmAction = (bookId) => {
    setSelectedBookId(bookId)
  }
  const onCancel = () => {
    setSelectedBookId(null)
  }
  return (
    <Container className='content'>
      <Row className="category-management">
        <Col>
          {selectedBookId &&
            <ConfirmationModal
              title={`Are You Sure to Proceed ?`}
              onConfirm={handleBookDelete}
              onCancel={onCancel} />
          }
          <div className="row p-3">
            <div className="col-12 grid-margin">
              <div className="card category-table">
                <div className="card-body">
                  <div className='d-flex  justify-content-between'>
                    <h4 className="table-title">All Books</h4>
                    <CButton onClick={() => { navigate('/admin/books/add', { state: { type: "create" } }) }}
                      color="success"
                      variant="outline">
                      Add Product
                    </CButton>
                  </div>

                  <form className="nav-link mt-2 mt-md-0 d-lg-flex search">
                    <input
                      type="text"
                      className="form-control mt-1"
                      placeholder="Search Books"
                      onChange={handleBookSearch}
                    />
                  </form>
                  <br />
                  <div className="table-responsive">

                    <CTable striped>
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
                              <img src={book?.images[0]?.secure_url} alt="book-img" className="category-image" />

                            </td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book?.category?.name}</td>
                            <td>
                              <CButton color="info" variant="outline"
                                onClick={() => navigate('/admin/books/view', { state: { book: book } })}
                              >
                                View
                              </CButton>
                            </td>
                            <td>
                              <CButton color="success" variant="outline"
                                onClick={() => { navigate('/admin/books/add', { state: { type: "update", bookDetails: book } }) }}
                              >
                                Update
                              </CButton>
                            </td>
                            <td>
                              <CButton color="danger" variant="outline"
                                onClick={() => confirmAction(book._id)}
                              >
                                {book.isDeleted ? "Recover" : "Delete"}
                              </CButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </CTable>
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

      </Row>
    </Container>
  );
};

export default ListBooks;
