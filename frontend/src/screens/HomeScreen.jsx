import Product from "../components/Product";
import { useQuery } from "@tanstack/react-query";
import { Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { fetchPoducts } from "../features/fetchProduct";
import { useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";

function HomeScreen() {
  let pages;
  const { keyword, page } = useParams();
  const {
    data: products,
    error,
    isError,
    isLoading,
    isSuccess,
  } = useQuery(["products", keyword, page], fetchPoducts);

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

  if (isSuccess) {
    pages = Math.ceil(products[0].total_count / 12);
  }

  return (
    <>
      {!keyword && <ProductCarousel />}
      <h1>latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col
            sm={12}
            md={6}
            lg={4}
            xl={3}
            key={product.id}
            className="d-flex align-items-stretch"
          >
            <Product product={product} />
          </Col>
        ))}
      </Row>
      {isSuccess && <Paginate page={page} pages={pages} keyword={keyword} />}
    </>
  );
}

export default HomeScreen;
