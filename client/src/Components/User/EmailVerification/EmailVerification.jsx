import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
import { toast } from 'react-toastify';

const EmailVerification = () => {
  const location = useLocation();
  const org = location.state?.origin;
  const userData = location.state?.userData;
  const [origin, setOrigin] = useState(org || "")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const formData = useSelector(state => state.registrationData)
  const { isLoggedIn } = useSelector(state => state.auth)
  const [email, setEmail] = useState("")
  const { loading, error } = useSelector(state => state.getOtp)
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [verifyError, setVerifyError] = useState("")
  const [sended, setSended] = useState(false)
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(-1)

  useEffect(() => {
    if (origin == "register") {
      setEmail(formData?.email)
    } else {
      setEmail(userData?.email)
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn && origin == "register") {
      navigate('/')
    }
  }, [isLoggedIn])



  useEffect(() => {
    if (error || verifyError) {
      toast.error(error || verifyError)
    }
  }, [error, verifyError])



  const resendOtp = () => {
    dispatch(getOtp(email))
    setTimer(60)
    setSended(true)
  }

  useEffect(() => {
    setSended(true)
    setTimer(60)
  }, [])

  useEffect(() => {
    if (timer > -1) {
      setTimeout(() => {
        setTimer(timer => timer - 1)

      }, 1000)
    }
    if (timer == 0) {
      setSended(false)
      setOtp("")
    }
  }, [timer])



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
        if (origin == "register") {
          return createUserAndNavigate()
        } else {
          try {
            await axiosUserInstance.put(`/${userData?._id}/edit`, userData)
            navigate('/account')
            toast.success("Updated Successfully")
          } catch (err) {
            toast.error("Somthing Went Wrong ..!")
          }
        }

      }
    } catch (err) {
      setVerificationLoading(false)
      toast.error(err?.response?.data?.message)
    }

  };
  const createUserAndNavigate = async () => {
    try {
      const created = await dispatch(createUser(formData))
      toast.success("User Created Successfully", {
        autoClose: 1500
      })
      setTimeout(() => {
        navigate('/')
      }, [1500])
    } catch (err) {
      console.log(err)
    }

  }
  const handleOtp = (e) => {
    const value = e.target.value
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  }


  return (
    <Container fluid className="login-register__container">
      <Row className="justify-content-center align-items-center vh-100">
        <Col xs="10" sm="8" md="6" lg="4" className="login bg-white p-4 shadow rounded">
          <h3 className="text-center mb-4">Verify Email</h3>
          {((loading || verificationLoading) == true) && <p>Loading....</p>}
          <Form onSubmit={verifyOtp}>
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

            <div className='space-between mt-4 p-2'>
              <div>
                <Link onClick={() => { navigate(-1) }} className='no-underline'>Back</Link>
              </div>
              <div >
                <span className='text-secondary'> Resend in : {sended && timer > -1 && timer}</span>
              </div>
              <div>
                <Link color="primary" className=" primary-btn no-underline" role='submit' onClick={sended ? verifyOtp : resendOtp}>
                  {sended ? "Register" : "Resend"}
                </Link>
              </div>
            </div>

          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EmailVerification;
