import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Message from "../components/Message";
import { topProduct } from "../features/fetchProduct";
import Loader from "../components/Loader";

const ProductCarousel = () => {
  const { data, error, isError, isLoading } = useQuery(
    ["topProduct"],
    topProduct
  );

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return (
      <Message variant="danger">
        {error.message} {error.response.data.message}
      </Message>
    );
  }

  return (
    <Carousel pause="hover" className="bg-dark">
      {data.map((product) => (
        <Carousel.Item key={product.id}>
          <Link tp={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid></Image>
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} ({Number(product.price)} DA)
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
