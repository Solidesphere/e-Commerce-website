import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useMutation } from "@tanstack/react-query";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { updateUserProfile } from "../features/fetchUsers";
import { getUserDetails } from "../features/fetchUsers";
import { getMyOrders } from "../features/fetchOrders";
import { useQuery } from "@tanstack/react-query";

const ProfileSceen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const userlogin = useSelector((state) => state.userInfo.value);
  const token = userlogin.token;
  const {
    mutate: updateProfile,
    isLoading,
    isError,
    isSuccess,

    error,
  } = useMutation(({ email, password }) =>
    updateUserProfile({ email, password, name, token })
  );

  const navigate = useNavigate();

  const userDetails = useQuery(["userDetails", token], getUserDetails);
  const {
    data: orders,
    isError: ordersIsError,
    isLoading: ordersIsLoading,
    error: ordersError,
  } = useQuery(["myOrders", token], getMyOrders);

  useEffect(() => {
    if (!userlogin) {
      navigate("/login");
    }

    if (userDetails.isSuccess) {
      setEmail(userDetails.data.email);
      setName(userDetails.data.name);
    }
  }, [userDetails.isSuccess]);

  const submitHndler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("password do not match");
    } else {
      updateProfile({ name, email, password, token });
    }
  };

  if (userDetails.isLoading) {
    return <Loader />;
  }

  if (userDetails.isError) {
    return (
      <Message variant="danger">
        {error.message} {error.response.userDetailsUpdated.message}
      </Message>
    );
  }

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant="danger">{message}</Message>}
        {isError && (
          <Message variant="danger">
            {error.message} {error.response.data.message}
          </Message>
        )}
        {isLoading && <Loader />}
        {isSuccess && <Message variant="success">Profile Updated</Message>}
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
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {ordersIsLoading ? (
          <Loader />
        ) : ordersIsError ? (
          <Message variant="denger">
            {ordersError.message} {ordersError.response.data.message}
          </Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVRED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{Number(order.TotalPrice)}</td>
                  <td>
                    {order.isPaid ? (
                      order.PaidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivred ? (
                      order.delivredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {" "}
                    <LinkContainer to={`/order/${order.id}`}>
                      <Button variant="light" className="btn-sm">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileSceen;
