import axios from "axios";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { CartContext } from "../context/ContextCart";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getOrdersById } from "../features/fetchOrders";
import { payOrder } from "../features/payAction";

const OrderScreen = () => {
  // eslint-disable-next-line no-unused-vars
  const { state: cart, _ } = useContext(CartContext);
  const [sdkReady, setSdkReady] = useState(false);
  const [clientId, setClientId] = useState(false);
  const userlogin = useSelector((state) => state.userInfo.value);
  const token = userlogin.token;
  //const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(["oreders", id, token], getOrdersById);

  const {
    //data,
    //mutate: pay,
    isLoading: payIsLoading,
    //isError: payisError,
    isSuccess: paySucess,
    //error: payError,
  } = useMutation(({ id, token, paymentResult }) =>
    payOrder({ id, token, paymentResult })
  );

  const successPaymentHandler = async (data) => {
    console.log(await data);
    //pay({ id, token, data });
  };
  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      setClientId(clientId);
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || paySucess) {
      refetch;
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [paySucess, refetch, order]);
  console.log(order);
  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger">
      {error.message} {error.response.data.message}
    </Message>
  ) : (
    <>
      <h1>Order {order.orderId}</h1>
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
                        {item.qty} x {Number(item.price)} DA ={" "}
                        {Number(item.price) * item.qty} DA
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
                  <Col>{Number(order.itemsPrice)} DA</Col>
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
              {!order.isPaid && (
                <ListGroup.Item>
                  {payIsLoading && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalScriptProvider>
                      <PayPalButtons
                        amount={Number(order.TotalPrice)}
                        onApprove={successPaymentHandler}
                      />
                    </PayPalScriptProvider>
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
