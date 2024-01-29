import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import {} from "@mui/material/colors";
import { SnackbarProvider } from "notistack";
import React, { createContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Auth/AuthProvider";
import { router } from "./router";

export const ErrorContext = createContext<Error | null>(null);

function App() {
  // For debugging the theme to disable set to null
  const themeOverride = null;

  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  const [mode, setMode] = React.useState<"light" | "dark">(themeOverride !== null ? themeOverride : darkThemeMq.matches ? "dark" : "light");

  // https://mui.com/material-ui/customization/default-theme/
  const theme = createTheme({
    palette: {
      primary: {
        main: "#47b25c",
        contrastText: "rgba(255,255,255,0.87)",
        dark: "#47b25c",
        light: "#47b25c",
      },
      secondary: {
        main: "#f50057",
      },
      background: {
        default: "#242b33",
        paper: "#31373f",
      },
      text: {
        primary: "#ffffff",
        secondary: "rgba(222,222,222,0.7)",
      },
    },
    typography: {
      fontFamily: ["Poppins", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: "#6b6b6b #2b2b2b",
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              backgroundColor: "#2b2b2b",
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 8,
              backgroundColor: "#6b6b6b",
              minHeight: 24,
              border: "3px solid #2b2b2b",
            },
            "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
              backgroundColor: "#959595",
            },
            "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
              backgroundColor: "#959595",
            },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#959595",
            },
            "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
              backgroundColor: "#2b2b2b",
            },
          },
        },
      },
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

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <AuthProvider clientId={import.meta.env.VITE_GOOGLE_APP_ID}>
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider maxSnack={3}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Box sx={{}}>
                <RouterProvider router={router} />
              </Box>
            </ThemeProvider>
          </SnackbarProvider>
        </QueryClientProvider>
      </React.StrictMode>
    </AuthProvider>
  );
}

export default App;
