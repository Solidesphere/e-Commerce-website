import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { fetchUserList, deleteUser } from "../features/fetchUsers";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import DeleteConfirmation from "../components/DeleteConfirmation";

const UserListScreen = () => {
  //Modal
  const [id, setId] = useState(null);
  const [userList, setUserList] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);

  const userlogin = useSelector((state) => state.userInfo.value);
  const token = userlogin.token;
  const navigate = useNavigate();
  const { data, isError, error, isLoading, isSuccess, refetch } = useQuery(
    ["userList", token],
    fetchUserList
  );

  const {
    data: userDelete,
    mutate: deleteUserFn,
    isLoading: deleteIsLoading,
    isError: deleteIsError,
    error: userError,
    isSuccess: successDelete,
  } = useMutation(({ token, id }) => deleteUser({ token, id }));

  useEffect(() => {
    if (!userlogin.isAdmin) {
      navigate("/login");
    } else {
      refetch();
    }
    if (successDelete) {
      refetch();
    }
    if (isSuccess) {
      setUserList(data);
    }
    refetch();
  }, [userlogin.isAdmin, navigate, successDelete, refetch, isSuccess, data]);

  const showDeleteModal = (id, name) => {
    setId(id);
    setDeleteMessage(
      `Are you sure you want to delete the user Id: ${id} name: ${name}`
    );
    setDisplayConfirmationModal(true);
  };
  // Hide the modal
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const deleteHandler = (id) => {
    deleteUserFn({ token, id });
    hideConfirmationModal(false);
  };

  return (
    <>
      <h1>Users</h1>
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
              <th>Email</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user.id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    className="btn-sm"
                    variant="danger"
                    onClick={() => showDeleteModal(user.id, user.name)}
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
    </>
  );
};

export default UserListScreen;
