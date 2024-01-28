import { createBrowserRouter } from "react-router-dom";
import { GuardedRoute } from "./Auth/GuardedRoute";
import ErrorPage from "./Pages/ErrorPage";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <GuardedRoute component={<HomePage />} />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/:uuid",
        element: <GuardedRoute component={<HomePage />} />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
    errorElement: <ErrorPage />,
  },
]);
