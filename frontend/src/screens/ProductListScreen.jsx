import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { fetchPoducts } from "../features/fetchProduct";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { deletePoduct, crateProduct } from "../features/fetchProduct";
import DeleteConfirmation from "../components/DeleteConfirmation";
import Paginate from "../components/Paginate";

const ProductListScreen = () => {
  let pages;
  const { page } = useParams();
  const [id, setId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);

  const [productList, setProductList] = useState([]);
  const userlogin = useSelector((state) => state.userInfo.value);
  const token = userlogin.token;
  const navigate = useNavigate();

  const { data, isError, error, isLoading, isSuccess, refetch } = useQuery(
    ["productList", "", page, token],
    fetchPoducts,
    {
      onSuccess: (data) => {
        setProductList(data);
      },
    }
  );

  const {
    mutate: deleteProdctFn,
    isLoading: deleteIsLoading,
    isError: deleteIsError,
    error: deleteError,
    isSuccess: successDelete,
  } = useMutation(({ token, id }) => deletePoduct({ token, id }));

  const {
    data: productCreated,
    mutate: createProdctFn,
    isLoading: createIsLoading,
    isError: createIsError,
    error: createError,
    isSuccess: successCreate,
  } = useMutation(({ token }) => crateProduct({ token }));

  const showDeleteModal = (id, name) => {
    setId(id);
    setDeleteMessage(
      `Are you sure you want to delete the prduct of Id: ${id} and name: ${name}`
    );
    setDisplayConfirmationModal(true);
  };
  // Hide the modal
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const deleteHandler = (id) => {
    deleteProdctFn({ token, id });
    hideConfirmationModal(false);
  };
  const createProductHandler = () => {
    createProdctFn({ token });
  };
  if (isSuccess) {
    pages = Math.ceil(data[0].total_count / 12);
  }
  useEffect(() => {
    if (!userlogin.isAdmin) {
      navigate("/login");
    } else {
      refetch();
    }
    if (successDelete) {
      refetch();
    }
    if (successCreate) {
      navigate(`/admin/product/${productCreated.id}/edit`);
    }
  }, [
    userlogin.isAdmin,
    navigate,
    refetch,
    successDelete,
    successCreate,
    productCreated,
  ]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>
      {createIsLoading && <Loader />}
      {createIsError && (
        <Message variant="danger">
          {createError.message} {createError.response.data.message}
        </Message>
      )}
      {successCreate && <Message variant="succcess">Product created</Message>}
      {deleteIsLoading ? (
        <Loader />
      ) : deleteIsError ? (
        <Message variant="danger">
          {deleteError.message} {deleteError.response.data.message}
        </Message>
      ) : (
        successDelete && <Message variant="success">Delete Success</Message>
      )}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {error.message} {error.response.data.message}
        </Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{Number(product.price)} DA</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product.id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    onClick={() => showDeleteModal(product.id, product.name)}
                    className="btn-sm"
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <DeleteConfirmation
        showModal={displayConfirmationModal}
        confirmModal={deleteHandler}
        hideModal={hideConfirmationModal}
        id={id}
        message={deleteMessage}
      />
      {isSuccess && <Paginate page={page} pages={pages} isAdmin={true} />}
    </>
  );
};

export default ProductListScreen;
