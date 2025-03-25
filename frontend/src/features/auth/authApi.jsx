/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, updateToken } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/v1/",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = api.getState().auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(logOut());
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: "user/token/refresh/",
        method: "POST",
        body: { refresh: refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      api.dispatch(updateToken(refreshResult.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "user/register/",
        method: "POST",
        body: userData,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (verificationData) => ({
        url: "user/verify-email/",
        method: "POST",
        body: verificationData,
      }),
    }),
    resendOtp: builder.mutation({
      query: (verificationData) => ({
        url: "user/resend-otp/",
        method: "POST",
        body: verificationData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "user/login/",
        method: "POST",
        body: credentials,
      }),
    }),
    getUserProfile: builder.query({
      query: () => "user/profile/",
    }),
    logout: builder.mutation({
      queryFn: async (_arg, { dispatch }) => {
        try {
          // Clear authentication state
          dispatch(logOut());
          dispatch(authApi.util.resetApiState());

          return { data: "Logged out successfully" };
        } catch (error) {
          return { error: { status: 500, message: "Logout failed" } };
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useGetUserProfileQuery,
  useLogoutMutation,
} = authApi;
