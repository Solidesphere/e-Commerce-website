import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrders } from "../features/fetchOrders";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const OrderListScreen = () => {
  const [orderList, setOrderList] = useState([]);

  const userlogin = useSelector((state) => state.userInfo.value);
  const token = userlogin.token;
  const navigate = useNavigate();
  const { data, isError, error, isLoading, isSuccess, refetch } = useQuery(
    ["ordersList", token],
    getOrders
  );

  useEffect(() => {
    if (!userlogin.isAdmin) {
      navigate("/login");
    } else {
      refetch();
    }
    if (isSuccess) {
      setOrderList(data);
    }
    refetch();
  }, [userlogin.isAdmin, navigate, refetch, isSuccess, data]);

  return (
    <>
      <h1>Orders</h1>
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
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${Number(order.TotalPrice)}</td>
                <td>
                  {order.isPaid ? (
                    order.PaidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivred ? (
                    order.delivredAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/admin/${order.orderId}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
