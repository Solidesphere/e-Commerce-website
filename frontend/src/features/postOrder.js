import axios from "axios";

const crateOrder = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
  };

  const res = await axios.post("/api/orders", data, config);

  if (res.isError) {
    throw new Error(`order failed`);
  }
  return res.data;
};

export { crateOrder };
