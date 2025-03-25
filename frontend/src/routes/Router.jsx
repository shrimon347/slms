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
        path: "/dashboard",
        element: SuspenseWrapper(Dashboard),
      },
    ],
  },
]);

export default router;
