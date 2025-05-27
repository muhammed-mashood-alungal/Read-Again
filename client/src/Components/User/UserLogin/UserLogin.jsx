import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import "./UserLogin.css";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../../redux/Actions/userActions";
import { useNavigate, Link, useLocation } from "react-router-dom";
import GoogleSignInButton from "../GoogleButton/GoogleButton";
import { toast } from "react-toastify";
import { validateLogin } from "../../../validations/loginValidation";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error: loginError } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const errorMessage = searchParams.get("error");

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = validateLogin({ email, password });
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    const success = await dispatch(userLogin({ email, password }));
    if (success) {
      toast.success("Login Success", {
        autoClose: 1500,
      });
      setTimeout(() => {
        navigate("/");
      }, [1500]);
    }
  };
  useEffect(() => {
    if (loginError || errorMessage) {
      toast.error(loginError || errorMessage);
    }
  }, [loginError]);

  return (
    <Container fluid className="">
      <Row className="justify-content-center align-items-center login-div">
        <Col
          xs="10"
          sm="8"
          md="6"
          lg="4"
          className="login bg-white p-4 shadow rounded"
        >
          <h3 className="text-center mb-4">Login</h3>

          <Form onSubmit={handleLogin}>
            <FormGroup>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form__input"
              />
            </FormGroup>
            <FormGroup>
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form__input"
              />
            </FormGroup>
            <button color="primary" block className="mt-3 primary-btn w-100">
              Login
            </button>
            <div className="d-flex justify-content-between align-items-center">
              <Link to={"/forgotten-password/verify"} className="no-underline">
                Forgotten Password ?{" "}
              </Link>

              <Link to={"/register"} className="no-underline">
                Create An Account
              </Link>
            </div>
          </Form>
          <Link
            to="https://read-again-api.mashood.site/api/users/auth/google"
            className="no-underline"
          >
            <GoogleSignInButton />
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default UserLogin;
