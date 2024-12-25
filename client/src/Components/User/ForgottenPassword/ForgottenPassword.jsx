import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup
} from 'reactstrap';
import './ForgottenPassword.css';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, getOtp } from '../../../redux/Actions/userActions';
import { axiosUserInstance } from '../../../redux/Constants/axiosConstants';
import { verifyEmail } from '../../../validations/verifyEmail';
import { toast } from 'react-toastify';

const ForgottenPassword = (props) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
 // const formData = useSelector(state => state.registrationData)
 const loaction = useLocation()
 const emailForOtp = loaction?.state?.email || ""
 const origin = loaction?.state?.origin
  const { loading, error } = useSelector(state => state.getOtp)
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [verifyError, setVerifyError] = useState("")
  const [email, setEmail] = useState(emailForOtp)
  const [sended, setSended] = useState(false)
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(-1)


  useEffect(() => {
    if (timer > -1 && !loading) {
      setTimeout(() => {
        setTimer(timer => timer - 1)
      }, 1000)
    }
    if (timer == 0) setSended(false)
  }, [timer, loading])



  const verifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length < 6) {
      setVerifyError("OTP must be 6 digits")
      return
    }
    setVerificationLoading(true)

    try {
      const response = await axiosUserInstance.post(`/${email}/verify-otp`, { otp })
      if (response.data.success) {
        setVerificationLoading(false)
          navigate('/forgotten-password/change-password' ,{state:{forgetPassEmail:email ,origin}})
        
      }
    } catch (err) {
      setVerificationLoading(false)
      toast.error(err?.response?.data?.message)
    }

  }

  const handleOtp = (e) => {
    const value = e.target.value
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value)
    }
  }

  const sendOtp = async (e) => {
    e.preventDefault()

    if (!email || email.trim() == "" || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      toast.error("Enter a valid Email Address")
      return
    }
    if (await verifyEmail(email)) {
      toast.error("Invalid Credential")
      return
    }

    setTimer(60)
    const response = dispatch(getOtp(email))
    if (response) setSended(true)
  }


  return (
    <Container fluid className="login-register__container">
      <Row className="justify-content-center align-items-center vh-100">
        <Col xs="10" sm="8" md="6" lg="4" className="login bg-white p-5 shadow rounded">
          <h3 className="text-center mb-4">Verify Email</h3>
          {((loading || verificationLoading) == true) && <p>Loading....</p>}

          <Form onSubmit={verifyOtp}>
            <FormGroup>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form__input"
                required
                disabled={sended}
              />
            </FormGroup>
            <FormGroup>
              <input
                type="text"
                placeholder="Enter OTP here"
                value={otp}
                onChange={handleOtp}
                className="form__input"
                required
                disabled={!sended}
              />
            </FormGroup>

            <div className='space-between mt-3'>
              <div>
              {sended ? 
              <Link color="primary" className="primary-btn no-underline" role='submit' onClick={verifyOtp}>
                Proceed
              </Link>
                :
                <Link color="primary" className=" primary-btn no-underline " role='submit' onClick={sendOtp}>
                  Sent OTP
                </Link>
              }
              </div>
               <div >
                {
                  sended &&   <span 
                  className='text-secondary'> Resend in : {sended && timer > -1 && timer}</span>

                }
              
              </div>

              <div>
                <Link onClick={() => { navigate(-1) }} >Back</Link>
              </div>
            </div>

          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgottenPassword;
