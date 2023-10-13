import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage";
import LoginPage from "./Pages/LoginPage";
import ServiceDownPage from "./Pages/ServiceDownPage";
import Constants from "./Utility/Constants";
import axios from "axios";

function App() {
  // Check to see if the backend is running
  // if there is an exception redirect to service down page and keep retrying connection
  axios
    .get(Constants.BackendUrl + "/status", { timeout: 500 })
    .catch(() => router.navigate("/serviceDown"))
    .then();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/serviceDown",
      element: <ServiceDownPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
    typography: {
      fontFamily: ["Poppins", '"Helvetica Neue"', "Arial", "sans-serif"].join(
        ","
      ),
    },
    shape: {
      borderRadius: 50,
    },
  });

  return (
    <GoogleOAuthProvider clientId="412063810327-6hekt3kap7sfjqi7djcarf0e9tqsb6ti.apps.googleusercontent.com">
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </React.StrictMode>
    </GoogleOAuthProvider>
  );
}

export default App;
