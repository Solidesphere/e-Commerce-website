import axios from "axios";
async function getOrdersById({ queryKey }) {
  const id = queryKey[1];
  const token = queryKey[2];
  if (!id) return [];

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const ApiRes = await axios.get(`/api/orders/${id}`, config);

  if (ApiRes.isError) {
    throw new Error(`Orders ${id} fetch not ok`);
  }

  return ApiRes.data;
}

async function getMyOrders({ queryKey }) {
  const token = queryKey[1];
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const ApiRes = await axios.get(`/api/orders/myorders`, config);

  if (ApiRes.isError) {
    throw new Error(`OrdersList fetch not ok`);
  }

  return ApiRes.data;
}

async function getOrders({ queryKey }) {
  const token = queryKey[1];
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const ApiRes = await axios.get(`/api/orders`, config);

  if (ApiRes.isError) {
    throw new Error(`Orders List fetch not ok`);
  }

  return ApiRes.data;
}

async function getOrdersByIdAdmin({ queryKey }) {
  const id = queryKey[1];
  const token = queryKey[2];
  if (!id) return [];

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const ApiRes = await axios.get(`/api/orders/admin/${id}`, config);

  if (ApiRes.isError) {
    throw new Error(`Orders ${id} fetch not ok`);
  }

  return ApiRes.data;
}

async function deliveredOred(data) {
  const config = {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  };
  const ApiRes = await axios.put(
    `/api/orders/${data.id}/deliver`,
    data,
    config
  );

  if (ApiRes.isError) {
    throw new Error(`Orders ${data.id} delivered not ok`);
  }

  return ApiRes.data;
}

export {
  getOrdersById,
  getMyOrders,
  getOrders,
  getOrdersByIdAdmin,
  deliveredOred,
};
