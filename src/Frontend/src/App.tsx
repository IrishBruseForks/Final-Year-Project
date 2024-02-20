import CloseIcon from "@mui/icons-material/Close";
import { Box, CssBaseline, IconButton, ThemeProvider, createTheme } from "@mui/material";
import {} from "@mui/material/colors";
import { SnackbarKey, SnackbarProvider, useSnackbar } from "notistack";
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
      mode: mode,
      primary: {
        main: "#47b25c",
        contrastText: "rgba(255, 255, 255, 0.87)",
      },
      secondary: {
        main: "#cb4c45",
      },
      error: {
        main: "#cb4c45",
      },
      background: {
        default: "#242B33",
        paper: "#31373F",
      },
      text: {
        primary: "#ffffff",
        secondary: "#acacac",
      },
      divider: "#31373F",
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: ["Poppins", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#31373F",
            color: "#fff",
            backgroundImage: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "#454d57",
            backgroundImage: "none",
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: "#61656b",
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            backgroundColor: "#454d57",
            color: "#ffffff",
            border: "none",
            "&.MuiAlert-icon": {
              color: "#ffffff",
            },
            "&.MuiAlert-message": {
              color: "#ffffff",
            },
            "&.MuiAlert-action": {
              color: "#ffffff",
            },
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              width: 10,
            },
            "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
              width: "1rem",
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 5,
              backgroundColor: "#50545b",
              minHeight: 24,
            },
            "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
              backgroundColor: "#6b6f77",
            },
            "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
              backgroundColor: "#6b6f77",
            },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#6b6f77",
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
          paper: { backgroundColor: "#454d57", backgroundImage: "none" },
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
        retry: 3,
        refetchOnWindowFocus: false,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });

  function SnackbarCloseButton({ snackbarKey }: { snackbarKey: SnackbarKey }) {
    const { closeSnackbar } = useSnackbar();

    return (
      <IconButton onClick={() => closeSnackbar(snackbarKey)}>
        <CloseIcon color="action" />
      </IconButton>
    );
  }

  return (
    <AuthProvider clientId={import.meta.env.VITE_GOOGLE_APP_ID}>
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider maxSnack={3} action={(snackbarKey) => <SnackbarCloseButton snackbarKey={snackbarKey} />}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Box>
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
