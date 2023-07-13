import { useState, useContext, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  fetchPoduct,
  createReview,
  getReviews,
} from "../features/fetchProduct";
import { CartContext } from "../context/ContextCart";
import { useSelector } from "react-redux";

const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewsList, setReviewsList] = useState([]);
  const { id } = useParams();
  const [token, setToken] = useState("");
  const userlogin = useSelector((state) => state.userInfo.value);
  const navigate = useNavigate();

  const {
    data: reviews,
    isLoading: reviewsIsLoading,
    isError: reviewsIsError,
    error: reviewsError,
    isSuccess,
    refetch,
  } = useQuery(["reviewsProduct", id], getReviews);

  const {
    mutate: postReview,
    isError: isErrorReview,
    isSuccess: isSuccessReview,
    error: errorReview,
  } = useMutation(({ token, comment, rating, id }) =>
    createReview({ token, comment, rating, id })
  );

  useEffect(() => {
    if (userlogin) {
      setToken(userlogin.token);
    }
    if (isSuccessReview) {
      refetch();
      setReviewsList(reviews);
    }
    if (isSuccess) {
      setReviewsList(reviews);
    }
  }, [userlogin, setToken, isSuccessReview, refetch, isSuccess, reviews]);

  const { data, isLoading, isError, error } = useQuery(
    ["product", id],
    fetchPoduct
  );

  // eslint-disable-next-line no-unused-vars
  const { _, dispatch } = useContext(CartContext);

  if (isLoading || reviewsIsLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <Message variant="danger">
        {error.message} {error.response.data.message}
      </Message>
    );
  }

  const product = data[0];

  const handleAddToCart = () => {
    const productAdded = {
      qty,
      name: product.name,
      image: product.image,
      price: product.price,
      id: product.id,
      countInStock: product.countInStock,
    };
    dispatch({ type: "ADD", payload: { ...productAdded } });
    navigate(`/cart`);
  };

  const submitHandler = (e) => {
    postReview({ token, comment, rating, id });
    e.preventDefault();
  };
  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      <Row>
        <Col md={6}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={Number(product.rating)}
                text={`${product.numReviews} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: {Number(product.price)} DA</ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong> {Number(product.price)} DA</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                  </Col>
                </Row>
              </ListGroup.Item>

              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Button
                  onClick={handleAddToCart}
                  className="w-100"
                  type="button"
                  disabled={product.countInStock === 0}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <h2>Reviews</h2>
          {reviewsList.length === 0 && <Message>No Reviews</Message>}
          <ListGroup variant="flush">
            {reviewsList.map((review) => (
              <ListGroup.Item key={review.id}>
                <strong>{review.name}</strong>
                <Rating value={Number(review.rating)} />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}

            <ListGroup.Item>
              <h2>Write a Customer Review</h2>
              {isErrorReview && (
                <Message variant="danger">
                  {errorReview.response.data.message}
                </Message>
              )}

              {userlogin ? (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as="select"
                      value={rating}
                      onChange={(e) => {
                        setRating(e.target.value);
                      }}
                    >
                      <option value="">Select ...</option>
                      <option value="1">1- Poor</option>
                      <option value="2">2- Fair</option>
                      <option value="3">3- Good</option>
                      <option value="4">4- Very Good</option>
                      <option value="5">5- Excellent</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="comment">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      row={5}
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                    ></Form.Control>
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    Submit
                  </Button>
                </Form>
              ) : (
                <Message>
                  please <Link to="/login">sign in</Link> to write a review
                </Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
