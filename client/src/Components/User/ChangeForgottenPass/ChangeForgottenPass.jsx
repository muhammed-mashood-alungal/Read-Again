import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Form, FormGroup } from 'reactstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { changePass } from '../../../redux/Actions/userActions';
import { validateChangePassword } from '../../../validations/passwordValidations';
import { toast } from 'react-toastify';

const ChangeForgottenPass = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const location =useLocation()
  const forgetPassEmail = location?.state?.forgetPassEmail
  const origin = location?.state?.origin
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(()=>{
    if(!forgetPassEmail){
      navigate('/forgotten-password/verify',{state:{origin:"login"}})
    }
  },[])

  const handleChangePassword =async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = validateChangePassword(newPassword,confirmPassword)
    if (result.success) {
      const success =  dispatch(changePass(forgetPassEmail,newPassword))
      setLoading(false)
      if(success){
        toast.success("Password Changed Successfully")
        if(origin == "my-account"){
          navigate('/account?tab=change-password')
        }else{
          navigate('/login')
        }
        
      }else{
        toast.error("Something Went Wrong")
      }
    } else {
      toast.error(result.message)
      setLoading(false);
    }
  };

  return (
    <Container fluid className="login-register__container">
      <Row className="justify-content-center align-items-center vh-100">
        <Col xs="10" sm="8" md="6" lg="4" className="login bg-white p-4 shadow rounded">
          <h3 className="text-center mb-4">Change Password</h3>
          {loading && <p>Loading....</p>}
          
          <Form onSubmit={handleChangePassword}>
            <FormGroup>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form__input"
                required
              />
            </FormGroup>
            <FormGroup>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form__input"
                required
              />
            </FormGroup>

            <div className="space-between mt-3">
              <Link
                color="primary"
                className="primary-btn no-underline"
                role="submit"
                onClick={handleChangePassword}
              >
                Change Password
              </Link>

              <div>
                <Link onClick={() => navigate(-1)}>Back</Link>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangeForgottenPass;
