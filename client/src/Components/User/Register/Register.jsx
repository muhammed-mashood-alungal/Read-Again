import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Button
} from 'reactstrap';
import './Register.css';
import { validateRegister } from '../../../validations/registerValidation';
import { useDispatch, useSelector } from 'react-redux';
import { getOtp, setRegistrationData } from '../../../redux/Actions/userActions';
import GoogleSignInButton from '../GoogleButton/GoogleButton';
import {  toast } from 'react-toastify';


const Register = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const errorMessage = searchParams.get("error");

  const data = useSelector(state=>state.registrationData)
  const [formData, setFormData] = useState({
    username: data ? data.username :'',
    email:data ? data.email :'',
    password: data ? data.password :'',
    confirmPassword: data ? data.confirmPassword :''
  });
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    if(errorMessage){
      toast.error(errorMessage);
    }
  },[])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister =async (e) => {
    console.log(formData)
    e.preventDefault();
   const result =await  validateRegister(formData)
   console.log(result)
   if(!result.success){
    toast.error(result.message);
   }else{
      dispatch(setRegistrationData(formData))
      dispatch(getOtp(formData.email))
      navigate('/register/verify',{ state: { origin: 'register' } })
   }
  }

  return (
    <Container fluid className="register-container">
      <Row className="justify-content-center align-items-center vh-100">
        <Col xs="10" sm="8" md="6" lg="4" className="register bg-white p-4 shadow rounded">
          <h3 className="text-center mb-4">Create an Account</h3>
   
          <Form onSubmit={handleRegister}>
            <FormGroup>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="form__input"
                required
              />
            </FormGroup>
            <FormGroup>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="form__input"
                required
              />
            </FormGroup>
            <FormGroup>
              <input
                type="password"
                name="password"
                placeholder="Your Password"
                value={formData.password}
                onChange={handleChange}
                className="form__input"
                required
              />
            </FormGroup>
            <FormGroup>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form__input"
                required
              />
            </FormGroup>
            
            <button color="primary" block className="mt-3 mb-3 primary-btn" >
              Submit & Register
            </button><br />
            
            <Link to={'/login'}>Already Have an Account ? </Link>
          </Form>
          <Link to="http://localhost:5000/api/users/auth/google" className='no-underline'>
            <GoogleSignInButton/>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
