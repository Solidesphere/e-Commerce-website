import { createSlice } from "@reduxjs/toolkit";

const shippingAdressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

export const shippingAdressSlice = createSlice({
  name: "shippingAddress",
  initialState: {
    value: shippingAdressFromStorage,
  },
  reducers: {
    saveShippingAdress: (state, action) => {
      state.value = action.payload;
      localStorage.setItem("shippingAddress", JSON.stringify(state.value));
    },
    removeShippingAdress: (state) => {
      localStorage.removeItem("shippingAddress");
      state.value = {};
    },
  },
});

export const { saveShippingAdress, removeShippingAdress } =
  shippingAdressSlice.actions;
export default shippingAdressSlice.reducer;
