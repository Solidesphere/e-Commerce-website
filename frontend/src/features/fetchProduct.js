import axios from "axios";

async function fetchPoduct({ queryKey }) {
  const id = queryKey[1];

  if (!id) return [];

  const ApiRes = await axios.get(`/api/products/${id}`);

  if (ApiRes.isError) {
    throw new Error(`Product ${id} fetch not ok`);
  }

  return ApiRes.data;
}

async function topProduct() {
  const ApiRes = await axios.get(`/api/products/top`);

  if (ApiRes.isError) {
    throw new Error(`Product  TOP fetch not ok`);
  }

  return ApiRes.data;
}

async function fetchPoducts({ queryKey }) {
  const keyword = queryKey[1] || "";
  const page = queryKey[2] || "";
  const ApiRes = await axios.get(
    `/api/products?keyword=${keyword}&page=${page}`
  );

  if (ApiRes.isError) {
    throw new Error(`Products fetch not ok`);
  }
  return ApiRes.data;
}
const deletePoduct = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
  };
  const res = await axios.delete(`/api/products/${data.id}`, config);
  if (res.isError) {
    throw new Error(`product delete failed`);
  }
  return res.data;
};

const crateProduct = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
  };

  const res = await axios.post("/api/products", data, config);

  if (res.isError) {
    throw new Error(`product create failed`);
  }
  return res.data;
};

const updateProduct = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
  };

  const res = await axios.put(`/api/products/${data.id}`, data, config);

  if (res.isError) {
    throw new Error(`product create failed`);
  }
  return res.data;
};

const createReview = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
  };

  const res = await axios.post(
    `/api/products/${data.id}/reviews`,
    data,
    config
  );

  if (res.isError) {
    throw new Error(`review create failed`);
  }
  return res.data;
};

async function getReviews({ queryKey }) {
  const id = queryKey[1];

  if (!id) return [];

  const ApiRes = await axios.get(`/api/products/${id}/reviews`);

  if (ApiRes.isError) {
    throw new Error(`Product ${id} fetch not ok`);
  }

  return ApiRes.data;
}

export {
  fetchPoduct,
  fetchPoducts,
  deletePoduct,
  crateProduct,
  updateProduct,
  createReview,
  getReviews,
  topProduct,
};
