import { createBrowserRouter } from "react-router-dom";
import { GuardedRoute } from "./Auth/GuardedRoute";
import ErrorPage from "./Pages/ErrorPage";
import LoginPage from "./Pages/LoginPage";
import MessagesPage from "./Pages/MessagesPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <GuardedRoute component={<MessagesPage />} />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/:uuid",
        element: <GuardedRoute component={<MessagesPage />} />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
    errorElement: <ErrorPage />,
  },
]);
