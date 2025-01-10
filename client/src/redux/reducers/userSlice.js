import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  token: localStorage.getItem("krist-app-token") || null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.currentUser = action.payload.user;
    },
    loginSuccess: (state, action) => {
      // Assuming the response contains the `user` and `token`
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("krist-app-token", action.payload.token);
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem("krist-app-token");
    },
  },
});

export const { updateUser, loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
