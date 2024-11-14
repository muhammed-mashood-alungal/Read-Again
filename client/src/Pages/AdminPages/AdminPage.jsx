import React, { useEffect } from 'react';
import { Row, Col, Container } from 'reactstrap';
import Navbar from '../../Components/Admin/Navbar/Navbar';
import './AdminPage.css';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/Admin/Sidebar/Sidebar';
import { getUserData } from '../../redux/Actions/userActions';
import { useDispatch, useSelector } from 'react-redux';

const AdminPage = () => {
  const dipatch = useDispatch()
  const navigate = useNavigate()
  


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
