import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { CartContext } from "../context/ContextCart";
import { crateOrder } from "../features/postOrder";
import { useMutation } from "@tanstack/react-query";

const PlaceOrderScreen = () => {
  // eslint-disable-next-line no-unused-vars
  const { state: cart, _ } = useContext(CartContext);
  const userlogin = useSelector((state) => state.userInfo.value);
  const { token } = userlogin;

  const navigate = useNavigate();
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  // Calculte prices
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );

  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);

  cart.taxPrice = addDecimals(Number((0.0 * cart.itemsPrice).toFixed(2)));

  const shippingAddress = useSelector((state) => state.shippingAddress.value);
  const paymentMethod = useSelector((state) => state.paymentMethod.value);

  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const orderData = {
    orderItems: cart.cartItems,
    shippingAddress: shippingAddress,
    paymentMethod: paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
    token: token,
  };
  const {
    data: order,
    mutate: postOrder,
    isError,
    isSuccess,
    error,
  } = useMutation((orderData) => crateOrder(orderData));

  useEffect(() => {
    if (isSuccess) {
      navigate(`/order/${order.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigate]);

  const placeOrderHandler = () => {
    postOrder(orderData);
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address},{shippingAddress.city} ,
                {shippingAddress.postalCode}, {shippingAddress.country},
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your Cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
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
                          {item.qty} x ${Number(item.price)} ={" "}
                          {Number(item.price) * item.qty} DA
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
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
                  <Col>{cart.itemsPrice} DA</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>{cart.shippingPrice} DA</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>{cart.taxPrice} DA</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{cart.totalPrice} DA</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {isError && (
                  <Message variant="danger">
                    {" "}
                    {error.message} {error.response.data.message}
                  </Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block w-100"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
