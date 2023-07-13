import { configureStore } from "@reduxjs/toolkit";
import userInfo from "./reducers/userInfoSlice";
import shippingAddress from "./reducers/shippingAdressSlice";
import paymentMethod from "./reducers/paymentMethodSlice";
const store = configureStore({
  reducer: {
    userInfo,
    shippingAddress,
    paymentMethod,
  },
});

export default store;
