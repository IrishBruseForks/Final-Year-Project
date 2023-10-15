import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import ServiceDownPage from "./Pages/ServiceDownPage";
import Api from "./Utility/Api";
import Constants from "./Utility/Constants";

function App() {
  // Check to see if the backend is running
  // if there is an exception redirect to service down page and keep retrying connection

  useEffect(() => {
    Api.Status().catch(() => {
      router.navigate("/serviceDown");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/home",
      element: <HomePage />,
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
    <GoogleOAuthProvider clientId={Constants.GoogleAppID}>
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
