import { useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { deliveredOred } from "../features/fetchOrders";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getOrdersByIdAdmin } from "../features/fetchOrders";

const OrderDetailsScreen = () => {
  // eslint-disable-next-line no-unused-vars

  const userlogin = useSelector((state) => state.userInfo.value);
  const token = userlogin.token;
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(["oreders", id, token], getOrdersByIdAdmin);

  const {
    mutate: delivered,
    isLoading: deliveredIsLoading,
    isSuccess: deliveredSucess,
  } = useMutation(({ id, token }) => deliveredOred({ id, token }));

  useEffect(() => {
    if (!order) {
      refetch();
    }
    if (deliveredSucess) {
      refetch();
      navigate("/admin/orderlist");
    }
  }, [refetch, order, deliveredSucess]);

  const deliverHandler = () => {
    delivered({ id, token });
  };

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger">
      {error.message} {error.response.data.message}
    </Message>
  ) : (
    <>
      <Link to="/admin/orderlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <h1>Order {order.id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.email}`}>{order.email}</a>{" "}
              </p>
              <p>
                <strong>Address: </strong>
                {order.ShippingAddress.address},{order.ShippingAddress.city} ,
                {order.ShippingAddress.postalCode},{" "}
                {order.ShippingAddress.country},
              </p>
              {order.isDelivred ? (
                <Message variant="success">
                  Delivred on {order.delevredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivred</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Piad</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item.id}>
                    <Row>
                      <Col md={1}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fluid
                          rounded
                        ></Image>
                      </Col>
                      <Col>
                        <Link to={`/product/${item.id}`}> {item.name}</Link>
                      </Col>
                      <Col md={5}>
                        {item.qty} x DA {Number(item.price)} = DA{" "}
                        {Number(item.price) * item.qty}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>{Number(order.itemsPrice)} DA </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>{Number(order.Shipping)} DA</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>{Number(order.taxPrice)} DA</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{Number(order.TotalPrice)} DA</Col>
                </Row>
              </ListGroup.Item>
              {userlogin && userlogin.isAdmin && !order.isDelivred && (
                <ListGroup.Item>
                  {deliveredIsLoading && <Loader />}
                  <Button
                    type="button"
                    className="btn btn-block w-100"
                    onClick={deliverHandler}
                  >
                    Mark as Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderDetailsScreen;
