import axios from "axios";

const payOrder = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
  };

  const res = await axios.put(
    `/api/orders/${data.id}/pay`,
    data.paymentResult,
    config
  );

  if (res.isError) {
    throw new Error(`order failed`);
  }
  return res.data;
};

export { payOrder };
