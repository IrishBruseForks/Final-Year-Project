import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SnackbarProvider } from "notistack";
import React, { createContext, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import ServiceDownPage from "./Pages/ServiceDownPage";
import Api from "./Utility/Api";
import Constants from "./Utility/Constants";

export const ErrorContext = createContext<Error | null>(null);

function App() {
  useEffect(() => {
    // Check to see if the backend is running
    // if there is an exception redirect to service down page and keep retrying connection
    Api.Status().catch(() => {
      router.navigate("/serviceDown");
    });

    // Check if we need to login again because we are either
    // missing the access token
    const token = localStorage.getItem(Constants.AccessTokenKey);

    if (token === null) {
      router.navigate("/login");
    } else {
      // We have a token
      // TODO: check if the token is expired and refresh it or login
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/",
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

  // For debugging the theme to disable set to null
  const themeOverride = null;

  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  const [mode, setMode] = React.useState<"light" | "dark">(themeOverride !== null ? themeOverride : darkThemeMq.matches ? "dark" : "light");

  // https://mui.com/material-ui/customization/default-theme/
  const theme = createTheme({
    palette: {
      mode: mode,
    },
    typography: {
      fontFamily: ["Poppins", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 28,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { backgroundColor: "#272727", backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.0))" },
        },
      },
    },
  });

  darkThemeMq.addEventListener("change", (e) => {
    if (e.matches) {
      setMode("dark");
    } else {
      setMode("light");
    }
  });

  return (
    <GoogleOAuthProvider clientId={Constants.GoogleAppID}>
      <React.StrictMode>
        <SnackbarProvider maxSnack={3}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
          </ThemeProvider>
        </SnackbarProvider>
      </React.StrictMode>
    </GoogleOAuthProvider>
  );
}

export default App;
