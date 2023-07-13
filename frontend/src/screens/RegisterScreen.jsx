import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { useDispatch } from "react-redux";
import { addUserInfo } from "../reducers/userInfoSlice";
import { register } from "../features/fetchUsers";

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const [queryParameters] = useSearchParams();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const redirect = queryParameters.get("redirect");
  const {
    data,
    mutate: registerUser,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutation(({ email, password }) => register({ email, password, name }));
  const userInfo = data;
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo) {
      dispatch(addUserInfo(userInfo));
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect, dispatch, confirmPassword, password]);

  const submitHndler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("password do not match");
    } else {
      registerUser({ email, password });
    }
  };
  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant="danger">{message}</Message>}
      {isError && (
        <Message variant="danger">
          {error.message} {error.response.data.message}
        </Message>
      )}
      {isLoading && <Loader />}
      {isSuccess && <Message>Welcome back</Message>}
      <Form onSubmit={submitHndler}>
        <Form.Group controlId="name" className="py-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email" className="py-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password" className="py-3">
          <Form.Label>password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="confirmPassword" className="py-3">
          <Form.Label> confirm password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Register
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          Have an Account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
