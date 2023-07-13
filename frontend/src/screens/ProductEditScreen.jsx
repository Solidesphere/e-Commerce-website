import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useMutation, useQuery } from "@tanstack/react-query";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { fetchPoduct, updateProduct } from "../features/fetchProduct";
import { useSelector } from "react-redux";

const ProductEditScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStouck] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const userlogin = useSelector((state) => state.userInfo.value);
  const token = userlogin.token;

  const {
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
    error: errorProduct,
    data: product,
    isSuccess: isSuccessProduct,
    refetch,
  } = useQuery(["product", id], fetchPoduct);

  const {
    mutate: update,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutation(
    ({
      token,
      name,
      price,
      image,
      category,
      brand,
      countInStock,
      description,
      id,
    }) =>
      updateProduct({
        token,
        name,
        price,
        image,
        category,
        brand,
        countInStock,
        description,
        id,
      })
  );

  useEffect(() => {
    if (isSuccessProduct) {
      setName(product[0].name);
      setPrice(product[0].price);
      setImage(product[0].image);
      setCategory(product[0].category);
      setBrand(product[0].brand);
      setCountInStouck(product[0].countInStock);
      setDescription(product[0].description);
    }
    if (isSuccess) {
      navigate("/admin/productlist");
    }
    refetch();
  }, [isSuccessProduct, isSuccess, refetch]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHndlerUpdate = (e) => {
    update({
      token,
      name,
      price,
      image,
      category,
      brand,
      countInStock,
      description,
      id,
    });
    e.preventDefault();
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {isLoadingProduct && <Loader />}

        {isErrorProduct && (
          <Message variant="danger">
            {errorProduct.message} {errorProduct.response.data.message}
          </Message>
        )}
        {isLoading && <Loader />}
        {isSuccess && <Message>Product UPDATED</Message>}
        {isError ? (
          <Message variant="danger">
            {error.message} {error.response.data.message}
          </Message>
        ) : (
          <Form onSubmit={submitHndlerUpdate}>
            <Form.Group controlId="name" className="py-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price" className="py-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter Pirce"
                value={Number(price)}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image" className="py-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                label="chose file"
                type="file"
                onChange={uploadFileHandler}
              ></Form.Control>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="category" className="py-3">
              <Form.Label>category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="brand" className="py-3">
              <Form.Label>brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock" className="py-3">
              <Form.Label>count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter count In Stouck"
                value={countInStock}
                onChange={(e) => setCountInStouck(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="py-3">
              <Form.Label>count In description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
