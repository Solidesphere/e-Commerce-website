import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { addUserInfo } from "../reducers/userInfoSlice";
import { login } from "../features/fetchUsers";

const LoginScreen = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const redirect = location.search ? location.search.split("=")[1] : "/";
  const {
    data: userInfo,
    mutate: LoginUser,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutation(({ email, password }) => login({ email, password }));
  const navigate = useNavigate();
  const userdata = useSelector((state) => state.userInfo.value);
  useEffect(() => {
    if (userdata) {
      navigate(redirect);
    } else {
      dispatch(addUserInfo(userInfo));
    }
  }, [navigate, userdata, redirect, dispatch, isSuccess, userInfo]);

  const submitHndler = (e) => {
    e.preventDefault();
    LoginUser({ email, password });
  };
  return (
    <FormContainer>
      <h1>Sign In</h1>
      {isError && (
        <Message variant="danger">
          {error.message} {error.response.data.message}
        </Message>
      )}
      {isLoading && <Loader />}
      {userdata && <Message>YOUR ARE ALREADY LOGEDIN</Message>}
      <Form onSubmit={submitHndler}>
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
        <Button type="submit" variant="primary">
          Sign In
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          New Customer?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
