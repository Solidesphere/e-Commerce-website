import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product.id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={Number(product.rating)}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as="h3"> {Number(product.price)} DA</Card.Text>
      </Card.Body>
    </Card>
  );
};
Product.propTypes = {
  product: PropTypes.object.isRequired,
};
export default Product;
