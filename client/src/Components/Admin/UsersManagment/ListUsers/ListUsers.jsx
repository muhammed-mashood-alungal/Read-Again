import React, { useState, useEffect } from 'react';
import './ListUsers.css';
import { Col, Container, Row } from 'reactstrap';
import UserForm from '../UserForm/UserForm';
import { axiosUserInstance } from '../../../../redux/Constants/axiosConstants';
import UserDetails from '../UserDetails/UserDetails';
import {useDispatch} from 'react-redux'
const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [userDetails,setUserDetails] = useState({})
  const [rightSide , setRightSide] = useState("create")
  const [listingError,setListingError]= useState("")
  const [currentPage,setCurrentPage]=useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const dispatch = useDispatch()
  const limit=10

  useEffect(() => {
   const fetchUsers =async()=>{
    
    try{
      const token= localStorage.getItem("token")
      const response = await axiosUserInstance.get(`/?page=${currentPage}&limit=${limit}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data)
      let pages= Math.ceil(response?.data?.totalUsers/limit)
      setTotalPages(pages)
      setUsers(response?.data?.users)
      console.log(response?.data?.users)
    }catch(err){
      console.log(err)
    }
     
    
    }
   fetchUsers()
  }, [currentPage]);
  
  const rightSideBar=()=>{
    if(rightSide === "create"){
      return <UserForm/>
    }
    if(rightSide === "details"){
      return <UserDetails user={userDetails}/>
    }
   
  }
  const viewUser =async (userId)=>{
    try{
      const response = await  axiosUserInstance.get(`/${userId}`)
      console.log(response.data.userData)
      setUserDetails(response.data.userData)
      setRightSide("details")
    }catch(err){
      console.log(err)
    }
  }

 

  
   const handleBlockUser =async (id) => {
    try{
      const token = localStorage.getItem("token")
     await axiosUserInstance.put(`/${id}/block`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
     console.log("recovered")
     setUsers(users=>{
      return users.map((user)=>{
        return user._id == id ? {...user,isBlocked : true} : user
      })
    })
    }catch(err){
     setListingError("Something Went Wrong While deleteing .Please try again")
    }
   };
   const handleUnBlockUser =async (id) => {
    try{
      const token = localStorage.getItem("token")
     await axiosUserInstance.put(`/${id}/unblock`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
     setUsers(users=>{
      return users.map((user)=>{
        return user._id == id ? {...user,isBlocked : false} : user
      })
    })
    }catch(err){
     setListingError("Something Went Wrong While deleteing .Please try again")
    }
   };
  

  return (
    <Container className='content'>
    <Row className="category-management">
      <Col md={8}>
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
                      <th>Name</th>
                      <th>Email</th>
                      <th>Membership</th>
                      <th>View Profile</th>
                      <th>Block User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>
                          {/* <img src={user.image} alt="Category" className="category-image" /> */}
                          <span>{user.username}</span>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.memberShipType}</td>
                        <td>
                          <div
                            className="badge badge-outline-success action-btn"
                            onClick={() => viewUser(user._id)}
                          >
                            View
                          </div>
                        </td>
                        <td>
                          <div
                            className="badge badge-outline-danger action-btn"
                            onClick={() => user.isBlocked ?  handleUnBlockUser(user._id) : handleBlockUser(user._id)}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
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
    <Col md={4} className='right-sidebar'>
     {rightSideBar()}
     {rightSide != "create" && <p onClick={()=>{setRightSide("create")}}>Back</p>}
    </Col>
    </Row>
    </Container>
  );
};

export default ListUsers;
