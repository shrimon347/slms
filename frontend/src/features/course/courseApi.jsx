import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, updateToken } from "../auth/authSlice";

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

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getEnrolledCourse: builder.query({
      query: () => ({
        url: "purchase/my-courses/",
        method: "GET",
      }),
    }),
    getEnrolledCourseModule: builder.query({
      query: (enrollments_id) => ({
        url: `courses/enrollments/${enrollments_id}/`,
        method: "GET",
      }),
    }),
    getEnrolledModuleLessons: builder.query({
      query: (enrollments_id) => ({
        url: `courses/enrollments/${enrollments_id}/modules/`,
        method: "GET",
      }),
    }),
    getEnrolledModuleQuizzes: builder.query({
      query: ({ enrollments_id, module_id }) => ({
        url: `courses/enrollments/${enrollments_id}/modules/${module_id}/quizzes/`,
        method: "GET",
      }),
    }),
    getAllCourses: builder.query({
      query: (category) => ({
        url: `courses/?category=${category}`,
        method: "GET",
      }),
    }),
    getAllCourseswithoutcategory: builder.query({
      query: () => ({
        url: `courses/`,
        method: "GET",
      }),
    }),
    getCoursesDetails: builder.query({
      query: (slug) => ({
        url: `courses/${slug}`,
        method: "GET",
      }),
    }),
    getBannerdata: builder.query({
      query: () => ({
        url: `courses/banner/`,
        method: "GET",
      }),
    }),
    getCoursesResources: builder.query({
      query: (enrollments_id) => ({
        url: `courses/enrollments/${enrollments_id}/classes/`,
        method: "GET",
      }),
    }),
    getChekoutCoursesDetails: builder.query({
      query: (slug) => ({
        url: `purchase/checkout-course/${slug}`,
        method: "GET",
      }),
    }),
    getAllCategory: builder.query({
      query: () => ({
        url: `courses/category/`,
        method: "GET",
      }),
    }),
    getQuizResult: builder.query({
      query: ({ enrollments_id, module_id,quiz_result_id }) => ({
        url: `courses/enrollments/${enrollments_id}/modules/${module_id}/quiz-results/${quiz_result_id}/`,
        method: "GET",
      }),
    }),
    quizSubmit: builder.mutation({
      query: (payload) => ({
        url: `courses/quiz/submit/`,
        method: "POST",
        body: payload,
      }),
    }),
    checkoutPayment: builder.mutation({
      query: ({ payload, courseSlug }) => ({
        url: `purchase/checkout?course=${courseSlug}`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetEnrolledCourseQuery,
  useLazyGetEnrolledCourseModuleQuery,
  useLazyGetAllCoursesQuery,
  useGetAllCategoryQuery,
  useLazyGetEnrolledModuleLessonsQuery,
  useLazyGetEnrolledModuleQuizzesQuery,
  useQuizSubmitMutation,
  useLazyGetQuizResultQuery,
  useLazyGetCoursesDetailsQuery,
  useLazyGetChekoutCoursesDetailsQuery,
  useCheckoutPaymentMutation,
  useGetCoursesResourcesQuery,
  useLazyGetAllCourseswithoutcategoryQuery,
  useGetBannerdataQuery
} = courseApi;
