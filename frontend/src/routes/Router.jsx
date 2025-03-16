import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import Mainlayout from "@/layout/Mainlayout";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const Home = lazy(() => import("../pages/homepage/Home"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        path: "/",
        element: SuspenseWrapper(Home),
      },
    ],
  },
]);

export default router;
