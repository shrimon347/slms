import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import DashboardLayout from "@/layout/DashboardLayout";
import Mainlayout from "@/layout/Mainlayout";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import PrivateRoute from "./PrivateRoute";

const Home = lazy(() => import("../pages/homepage/Home"));
const Login = lazy(() => import("../pages/login_register_page/Login"));
const Register = lazy(() => import("../pages/login_register_page/Register"));
const VerifyEmail = lazy(() =>
  import("../pages/login_register_page/VerifyEmail")
);
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard.jsx"));
const StudentCourses = lazy(()=> import("../pages/dashboard/courses/StudentCourses"))
const CourseDetails = lazy(()=> import("../pages/dashboard/courses/StudentCourseDetails"))
const CourseModuleLessonVideo = lazy(()=> import("../pages/dashboard/courses/CourseModuleLessonVideo"))
const QuizzDetails = lazy(()=> import("../pages/dashboard/courses/QuizzDetails"))
const QuizzGuideline = lazy(()=> import("../pages/dashboard/courses/QuizzGuideline"))
const QuizResult = lazy(()=> import("../pages/dashboard/courses/QuizResult"))
const QuizCheckAnswer = lazy(()=> import("../pages/dashboard/courses/QuizCheckAnswer"))
const Profile = lazy(()=> import("../pages/dashboard/profile/Profile"))
const CoursesDetails = lazy(()=> import("../pages/courses/CourseDetails"))
const CoursesResources = lazy(()=> import("../pages/courses/ResourcesPage"))
const CoursesRecordings = lazy(()=> import("../pages/courses/RecordingsPage"))
const CoursesJoinClass = lazy(()=> import("../pages/courses/JoinClassPage"))
const CoursesChekout = lazy(()=> import("../pages/courses/CourseChekout"))
const Courses = lazy(()=> import("../pages/courses/Courses"))
const About = lazy(()=> import("../pages/contact/About"))
const ForgotPassword = lazy(() => import("../pages/login_register_page/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/login_register_page/ResetPassword"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        path: "/",
        element: SuspenseWrapper(Home),
      },
      {
        path: "/login",
        element: SuspenseWrapper(Login),
      },
      {
        path: "/register",
        element: SuspenseWrapper(Register),
      },
      {
        path: "/forgot-password",
        element: SuspenseWrapper(ForgotPassword),
      },
      {
        path: "/api/v1/user/reset/:uid/:token",
        element: SuspenseWrapper(ResetPassword),
      },
      {
        path: "/verify-email",
        element: SuspenseWrapper(VerifyEmail),
      },
      {
        path: "/courses/:slug",
        element: SuspenseWrapper(CoursesDetails),
      },
      {
        path: "/courses",
        element: SuspenseWrapper(Courses),
      },
      {
        path: "/about",
        element: SuspenseWrapper(About),
      },
      {
        path: "/purchase/checkout",
        element: SuspenseWrapper(CoursesChekout),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "profile",
        element: SuspenseWrapper(Profile),
      },
      {
        path: "my-courses",
        element: SuspenseWrapper(StudentCourses),
      },
      {
        path: "my-courses/resources",
        element: SuspenseWrapper(CoursesResources),
      },
      {
        path: "my-courses/recordings",
        element: SuspenseWrapper(CoursesRecordings),
      },
      {
        path: "my-courses/join-class",
        element: SuspenseWrapper(CoursesJoinClass),
      },
      {
        path: "my-courses/:courseId",
        element: SuspenseWrapper(CourseDetails),
      },
      {
        path: "my-courses/:courseId/recordings",
        element: SuspenseWrapper(CourseModuleLessonVideo),
      },
      {
        path: "my-courses/:courseId/modules/:moduleId/quizes/start",
        element: SuspenseWrapper(QuizzDetails),
      },
      {
        path: "my-courses/:courseId/modules/:moduleId/quizes/guidelines",
        element: SuspenseWrapper(QuizzGuideline),
      },
      {
        path: "my-courses/:courseId/modules/:moduleId/quizes/:quizId/result",
        element: SuspenseWrapper(QuizResult),
      },
      {
        path: "my-courses/:courseId/modules/:moduleId/quizes/:quizId/checked/answer",
        element: SuspenseWrapper(QuizCheckAnswer),
      },
    ],
  },
]);

export default router;
