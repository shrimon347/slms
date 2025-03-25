import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import Mainlayout from "@/layout/Mainlayout";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const Home = lazy(() => import("../pages/homepage/Home"));
const Login = lazy(() => import("../pages/login_register_page/Login"));
const Register = lazy(() => import("../pages/login_register_page/Register"));
const VerifyEmail = lazy(() => import("../pages/login_register_page/VerifyEmail")); 

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
]);

export default router;
