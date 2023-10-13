import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import axios from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ServiceDownPage from "./Pages/ServiceDownPage";
import Constants from "./Utility/Constants";
import React from "react";
import HomePage from "./Pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
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
    borderRadius: 12,
  },
});

// Check to see if the backend is running
// if there is an exception redirect to service down page
try {
  await axios.get(Constants.BackendUrl + "/status", { timeout: 500 });
} catch (error: unknown) {
  router.navigate("/serviceDown");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="412063810327-6hekt3kap7sfjqi7djcarf0e9tqsb6ti.apps.googleusercontent.com">
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline></CssBaseline>
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
