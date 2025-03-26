import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"
import { authApi } from "@/features/auth/authApi";
import { courseApi } from "@/features/course/courseApi";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]:courseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(courseApi.middleware),
});
