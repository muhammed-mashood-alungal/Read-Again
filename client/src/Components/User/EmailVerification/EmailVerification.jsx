import React, { useContext, useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup
} from 'reactstrap';
import './EmailVerification.css';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, getOtp } from '../../../redux/Actions/userActions';
import { axiosUserInstance } from '../../../redux/Constants/axiosConstants';
import { verifyEmail } from './verifyEmail';
import { ForgetPasswordContext } from '../../../contexts/forgetPassword';

const EmailVerification = (props) => {
  
  const navigate = useNavigate()
  const dispatch= useDispatch()
  const formData = useSelector(state=>state.registrationData)
  const {loading ,error} = useSelector(state=>state.getOtp)
 // const {setForgetPassEmail} = useContext(ForgetPasswordContext)
  const [verificationLoading ,setVerificationLoading] = useState(false)
  const [verifyError , setVerifyError] = useState("")
  // const [email, setEmail] = useState(formData ? formData.email : '');
  const [sended, setSended] = useState(false)
  const [otp, setOtp] = useState("");
  const [timer , setTimer]=useState(-1)
  const [err,setErr]=useState("")
  useEffect(()=>{
    console.log(formData)
    if(!formData.email){
      navigate('/register')
    }

  },[formData,timer])
  useEffect(()=>{
    if(error || verifyError){
        setErr(error || verifyError)
    }
  },[error,verifyError])

  const resendOtp= ()=>{
    console.log("resending", formData.email)
    dispatch(getOtp(formData.email))
    setTimer(60)
    setSended(true)
    setErr("")
  }

  useEffect(()=>{
    setSended(true)
    setTimer(60)
  },[])
  
  useEffect(()=>{
  if(timer > -1 ){
    setTimeout(()=>{
      setTimer(timer=>timer-1)
      
    },1000)
  }
  if(timer ==0){
    setSended(false)
    setOtp("")
  } 
  },[timer,loading])


 
  const verifyOtp = async (e) => { 
    e.preventDefault()
    if(otp.length < 6){
      setVerifyError("OTP must be 6 digits")
      return
    }
    setVerificationLoading(true)
    
    try{
      const response = await axiosUserInstance.post(`/${formData.email}/verify-otp`, {otp})
      if(response.data.success){
        console.log("verification success")
        setVerificationLoading(false)
        createUserAndNavigate()
      }
    }catch(err){
      console.log(err.response)
      setVerificationLoading(false)
      setVerifyError(err.response.data.message)
    }
    
  };
  const createUserAndNavigate=async()=>{
    try{
      const created= await dispatch(createUser(formData))
      if(created){
        navigate('/')
      }
      console.log("user creating")
    }catch(err){
     console.log(err)
    }
    
  }
  const handleOtp=(e)=>{
    const value=e.target.value
     if(/^\d*$/.test(value) && value.length <= 6) {
        setOtp(value);
      }
  }
 
  // const sendOtp =async (e)=>{
  //   setVerifyError('')
    
  //   e.preventDefault()
    
  //   if(!email ||email.trim() == "" || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) ){
  //     setVerifyError("Enter a valid Email Address")
  //     return
  //   }
  //   if(props.type !="registration" && await verifyEmail(email)){
  //     setVerifyError("Invalid Credential")
  //     return
  //   }
    
  //   setTimer(60)
  //   const response = await dispatch(getOtp(email))
  //   if(response) setSended(true)
  // }


  return (
    <Container fluid className="login-register__container">
      <Row className="justify-content-center align-items-center vh-100">
        <Col xs="10" sm="8" md="6" lg="4" className="login bg-white p-4 shadow rounded">
          <h3 className="text-center mb-4">Verify Email</h3>
          {((loading || verificationLoading) == true) && <p>Loading....</p>}
          {err && <p>{err}</p>}
          {/* {verifyError && <p>{verifyError}</p>} */}
          <Form onSubmit={verifyOtp}>
            {/* <FormGroup>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form__input"
                required
                disabled={sended}
              />
            </FormGroup> */}
            <FormGroup>
              <input
                type="text"
                placeholder="Enter OTP here"
                value={otp}
                onChange={handleOtp}
                className="form__input"
                required
              />
            </FormGroup>

            <div className='space-between mt-3'>
              { <Link color="primary"  className=" primary-btn no-underline" role='submit' onClick={ sended ? verifyOtp : resendOtp}>
                           {sended ? "Register" : "Resend"}
                       </Link>
            }
           
           
            <div>
            <Link onClick={()=>{navigate(-1)}} >Back</Link><br />
            {sended && timer > -1  && <p>{timer}</p> }
            </div>
            </div>
            
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EmailVerification;
