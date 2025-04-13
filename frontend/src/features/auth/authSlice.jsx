import { createSlice } from "@reduxjs/toolkit";
import {
  clearAuthData,
  getAuthData,
  setAuthData,
} from "../../utils/localStorage";

const initialState = getAuthData();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserCredentials: (state, action) => {
      const { user, access, refresh } = action.payload;
      state.user = user;
      state.accessToken = access;
      state.refreshToken = refresh;

      setAuthData(user, access, refresh);
    },
    updateUser: (state, action) => {
      const user = action.payload;
      state.user = user;

      setAuthData(user, state.accessToken, state.refreshToken);
    },
    updateToken: (state, action) => {
      const { access, refresh } = action.payload;
      state.accessToken = access;
      state.refreshToken = refresh;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
    },
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      clearAuthData();
    },
  },
});

export const { setUserCredentials, updateToken, logOut, updateUser } = authSlice.actions;
export default authSlice.reducer;
