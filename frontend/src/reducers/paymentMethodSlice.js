import { createSlice } from "@reduxjs/toolkit";

const paymentMethodFromStorage = localStorage.getItem("paymentMethod")
  ? JSON.parse(localStorage.getItem("paymentMethod"))
  : null;

export const paymentMethodSlice = createSlice({
  name: "paymentMethod",
  initialState: {
    value: paymentMethodFromStorage,
  },
  reducers: {
    savePaymentMethod: (state, action) => {
      state.value = action.payload;
      localStorage.setItem("paymentMethod", JSON.stringify(state.value));
    },
    removePaymentMethod: (state) => {
      localStorage.removeItem("paymentMethod");
      state.value = null;
    },
  },
});

export const { savePaymentMethod, removePaymentMethod } =
  paymentMethodSlice.actions;
export default paymentMethodSlice.reducer;
