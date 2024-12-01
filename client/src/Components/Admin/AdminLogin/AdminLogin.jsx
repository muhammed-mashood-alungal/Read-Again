import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
} from 'reactstrap';
import './AdminLogin.css';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../../redux/Actions/userActions';
import { useNavigate  ,Link} from 'react-router-dom';
import { validateLogin } from '../../../validations/loginValidation';
import { axiosAdminInstance } from '../../../redux/Constants/axiosConstants';
import Toast from '../../Toast/Toast';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch= useDispatch()
  const navigate= useNavigate()
  
  const {isLoggedIn , role} = useSelector(state=>state.auth)
  
  useEffect(()=>{
    console.log(isLoggedIn,role)
     if(isLoggedIn && role === "ADMIN"){
       navigate('/admin')
     }else if(!isLoggedIn){
      navigate('/admin/login')
     }else{
      navigate('/')
     }
  },[role,isLoggedIn,dispatch])

  const handleLogin = async(e) => {
    e.preventDefault();
    const result = validateLogin({email,password})
    console.log(result)
    if(!result.success){
      toast.error(result.message)
      return
    }
    try{
      const response = await axiosAdminInstance.post('/login',{email,password})
       if(response.status == 200){
        toast.success("Login Success",{
          autoClose: 1500
        })
        setTimeout(()=>{
          navigate('/admin')
        },[1500])
       } 
    }catch(err){
      console.log(err)
      toast.error(err?.response?.data?.message)
    }
  };

  return (
    <Container fluid className="login-register__container">
      <Row className="justify-content-center align-items-center vh-100">
        <Col xs="10" sm="8" md="6" lg="4" className="login bg-white p-4 shadow rounded">
          <h3 className="text-center mb-4">Admin Login</h3>
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form__input"
                required
              />
            </FormGroup>
            <FormGroup>
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form__input"
                required
              />
            </FormGroup>
            <Button color="primary" block className="mt-3">
              Login
            </Button>
            
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;