import React, { useState, useEffect } from 'react';
import './ListUsers.css';
import { Col, Container, Row } from 'reactstrap';
import { axiosUserInstance } from '../../../../redux/Constants/axiosConstants';
import { useDispatch } from 'react-redux'
import ConfirmationModal from '../../../CommonComponents/ConfirmationModal/ConfirmationModal';
import { CButton, CTable } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState({})
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [showUserData, setShowUserData] = useState(false)
  const [action, setAction] = useState("")
  const [listingError, setListingError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const dispatch = useDispatch()
  const limit = 10
  const navigate = useNavigate()
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axiosUserInstance.get(`/?page=${currentPage}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        let pages = Math.ceil(response?.data?.totalUsers / limit)
        setTotalPages(pages)
        setUsers(response?.data?.users)
      } catch (err) {
        console.log(err)
      }
    }
    fetchUsers()
  }, [currentPage])

  const handleBlockUser = async (id) => {
    try {

      await axiosUserInstance.put(`/${id}/block`)
      setUsers(users => {
        return users.map((user) => {
          return user._id == id ? { ...user, isBlocked: true } : user
        })
      })
    } catch (err) {
      setListingError("Something Went Wrong While deleteing .Please try again")
    }
  };
  const handleUnBlockUser = async (id) => {
    try {
      const token = localStorage.getItem("token")
      await axiosUserInstance.put(`/${id}/unblock`)
      setUsers(users => {
        return users.map((user) => {
          return user._id == id ? { ...user, isBlocked: false } : user
        })
      })
    } catch (err) {
      setListingError("Something Went Wrong While deleteing .Please try again")
    }
  };
  const handleUserSearch = async (e) => {
    try {
      const name = e.target.value
      const response = await axiosUserInstance.get(`/?page=${currentPage}&limit=${limit}&name=${name}`)
      let pages = Math.ceil(response?.data?.totalUsers / limit)
      setTotalPages(pages)
      setUsers(response?.data?.users)
    } catch (err) {
      console.log(err)
    }
  }

  const confirmAction = (userId, action) => {
    setSelectedUserId(userId)
    setAction(action)
  }
  const onConfirm = () => {
    if (action == "BLOCK") {
      handleBlockUser(selectedUserId)
      setSelectedUserId(null)
      setAction("")
    } else {
      handleUnBlockUser(selectedUserId)
      setSelectedUserId(null)
      setAction("")
    }
  }
  const onCancel = () => {
    setSelectedUserId(null)
    setAction("")
  }
  return (
    <Container className='content'>
      <Row className="category-management">
        <Col >
          {selectedUserId &&
            <ConfirmationModal
              title={`Confirm ${action == "BLOCK" ? "Blocking" : "Un Blocking"} this User`}
              message="Are You Sure to Proceed ?"
              onConfirm={onConfirm}
              onCancel={onCancel} />
          }
          <h4 className="title">User Management</h4>

          <div className="row p-3">
            <div className="col-12 grid-margin">
              <div className="card category-table">
                <div className="card-body">
                  <h4 className="table-title">Users</h4>
                  <form className="nav-link mt-2 mt-md-0 d-lg-flex search">
                    <input
                      type="text"
                      className="form-control mt-1"
                      placeholder="Search Users"
                      onChange={handleUserSearch}
                    />
                  </form>
                  <br />
                  <div className="table-responsive">

                    <CTable striped>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Is Active</th>
                          <th>View Profile</th>
                          <th>Block User</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user._id}>
                            <td>
                              <span>{user.username}</span>
                            </td>
                            <td>{user.email}</td>
                            <td>
                              {
                                !user.isBlocked ? "Acitive" : "Blocked"
                              }
                            </td>
                            <td>
                              <CButton color="info" variant="outline"
                                onClick={() => navigate('/admin/users/view', { state: { user: user } })}
                              >
                                View
                              </CButton>
                            </td>
                            <td>
                              <CButton color="danger" variant="outline"
                                onClick={() => user.isBlocked ? confirmAction(user._id, "UN_BLOCK") : confirmAction(user._id, "BLOCK")}
                              >
                                {user.isBlocked ? "Unblock" : "Block"}
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

export default ListUsers;
