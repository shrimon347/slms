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
        path: "/verify-email",
        element: SuspenseWrapper(VerifyEmail),
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
        path: "my-courses",
        element: SuspenseWrapper(StudentCourses),
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
    ],
  },
]);

export default router;
