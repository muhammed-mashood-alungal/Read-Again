import React, { useEffect } from 'react';
import { Row, Col, Container } from 'reactstrap';
import Navbar from '../../Components/Admin/Navbar/Navbar';
import './AdminPage.css';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/Admin/Sidebar/Sidebar';
import { getUserData, removeAuth, setAuth } from '../../redux/Actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { axiosAuthInstance } from '../../redux/Constants/axiosConstants';

const AdminPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {isLoggedIn , role} = useSelector(state=>state.auth)
  
  useEffect(()=>{
    console.log(isLoggedIn,role)
    if(isLoggedIn && role != "ADMIN"){
    //  navigate('/')
    }else if(!isLoggedIn){
    navigate('/admin/login')
   }
  },[role,isLoggedIn])
  

  useEffect(() => {
    const checkAuth = async () => {
        try {
            const response = await axiosAuthInstance.get('/check-auth');
            dispatch(setAuth(response.data));
        } catch (error) {
            console.error('Token verification failed:', error);
            dispatch(removeAuth());
        }
    }
    checkAuth()
}, [dispatch])


  

  return (
    <Container fluid className="admin-container">
      <Row>
        <Col md={12}>
         <Navbar/>
        </Col>
        <Row className='admin-main'>
          <Col md={2}> <Sidebar/></Col>
          <Col md={10}> <Outlet/> </Col>
        </Row>
       </Row>
    </Container>
  );
};

export default AdminPage;
