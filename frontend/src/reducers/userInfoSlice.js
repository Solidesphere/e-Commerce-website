import { createSlice } from "@reduxjs/toolkit";

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

export const infoUserSlice = createSlice({
  name: "userInfo",
  initialState: {
    value: userInfoFromStorage,
  },
  reducers: {
    addUserInfo: (state, action) => {
      state.value = action.payload;
    },
    removeUserInfo: (state) => {
      localStorage.removeItem("userInfo");
      state.value = null;
    },
  },
});

export const { addUserInfo, removeUserInfo } = infoUserSlice.actions;
export default infoUserSlice.reducer;
