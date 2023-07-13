import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useMutation, useQuery } from "@tanstack/react-query";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { getUserById, updateUser } from "../features/fetchUsers";

import { useSelector } from "react-redux";

const UserEditScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const userlogin = useSelector((state) => state.userInfo.value);
  const token = userlogin.token;

  const {
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: errorUser,
    data: user,
    isSuccess: isSuccessUser,
    refetch,
  } = useQuery(["userDetails", userId, token], getUserById);

  const {
    mutate: update,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutation(({ token, userId, email, isAdmin, name }) =>
    updateUser({ token, userId, email, isAdmin, name })
  );

  useEffect(() => {
    if (isSuccessUser) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
    if (isSuccess) {
      navigate("/admin/userlist");
    }
    refetch();
  }, [isSuccessUser, isSuccess, refetch]);

  const submitHndler = (e) => {
    update({ token, userId, email, isAdmin, name });
    e.preventDefault();
  };
  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {isLoadingUser && <Loader />}

        {isError && (
          <Message variant="danger">
            {error.message} {error.response.data.message}
          </Message>
        )}
        {isLoading && <Loader />}
        {isSuccess && <Message>USER UPDATED</Message>}
        {isErrorUser ? (
          <Message variant="danger">
            {errorUser.message} {errorUser.response.data.message}
          </Message>
        ) : (
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

            <Form.Group controlId="isadmin" className="py-3">
              <Form.Check
                type="checkbox"
                label="is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
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

export default UserEditScreen;
