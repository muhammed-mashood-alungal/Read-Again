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
import './UserLogin.css';
import { validateLogin } from './loginValidation';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../../redux/Actions/userActions';
import { useNavigate  ,Link, useLocation} from 'react-router-dom';
import GoogleSignInButton from '../GoogleButton/GoogleButton';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toast from '../../Toast/Toast';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {error:loginError} = useSelector(state=>state.user)
  const dispatch= useDispatch()
  const navigate= useNavigate()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const errorMessage = searchParams.get("error");

  const handleLogin = async(e) => {
    e.preventDefault();
    const result = validateLogin({email,password})
    console.log(result)
    if(!result.success){
      toast.error(result.message)
      return
    }
   const success = await dispatch(userLogin({email,password}))
   if(success){
    toast.success("Login Success",{
      autoClose: 1500
    })
    setTimeout(()=>{
      navigate('/')
    },[1500])
   }
  };
  useEffect(()=>{
   if(loginError || errorMessage){
    toast.error(loginError || errorMessage)
   }
  },[loginError])

  return (
    <Container fluid className="login-register__container">
      <Row className="justify-content-center align-items-center vh-100">
        <Col xs="10" sm="8" md="6" lg="4" className="login bg-white p-4 shadow rounded">
        <Toast />
          <h3 className="text-center mb-4">Login</h3>
         
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
            <br />
            <Link to={"/forgotten-password/verify"}>Forgotten Password ? </Link>
            <br />
            <Link to={"/register"}>Create An Account</Link>
          </Form>
          <Link to="http://localhost:5000/api/users/auth/google" className='no-underline'>
            <GoogleSignInButton/>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default UserLogin;
