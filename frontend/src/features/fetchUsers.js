import axios from "axios";

const login = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await axios.post("/api/users/login", data, config);

  if (res.isError) {
    throw new Error(`Login failed`);
  }
  localStorage.setItem("userInfo", JSON.stringify(res.data));
  return res.data;
};

const register = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await axios.post("/api/users", data, config);

  if (res.isError) {
    throw new Error(`Register failed`);
  }
  localStorage.setItem("userInfo", JSON.stringify(res.data));
  return res.data;
};

const getUserDetails = async ({ queryKey }) => {
  const token = queryKey[1];
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(`/api/users/profile`, config);

  if (res.isError) {
    throw new Error(`Get User Details Failed`);
  }
  return res.data;
};

const getUserById = async ({ queryKey }) => {
  const id = queryKey[1];
  const token = queryKey[2];
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(`/api/users/${id}`, config);

  if (res.isError) {
    throw new Error(`Get User Details Failed`);
  }
  return res.data;
};

const updateUserProfile = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
  };

  const res = await axios.put("/api/users/profile", data, config);

  if (res.isError) {
    throw new Error(`update failed`);
  }
  localStorage.setItem("userInfo", JSON.stringify(res.data));
  return res.data;
};

const fetchUserList = async ({ queryKey }) => {
  const token = queryKey[1];
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get("/api/users", config);
  if (res.isError) {
    throw new Error(`users List failed`);
  }
  return res.data;
};

const deleteUser = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
  };
  const res = await axios.delete(`/api/users/${data.id}`, config);
  if (res.isError) {
    throw new Error(`users delete failed`);
  }
  return res.data;
};

const updateUser = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
  };

  const res = await axios.put(`/api/users/${data.userId}`, data, config);

  if (res.isError) {
    throw new Error(`update failed`);
  }
  return res.data;
};

export {
  login,
  register,
  getUserDetails,
  updateUserProfile,
  fetchUserList,
  deleteUser,
  getUserById,
  updateUser,
};
