import CloseIcon from "@mui/icons-material/Close";
import { CssBaseline, IconButton, ThemeProvider, createTheme } from "@mui/material";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { SnackbarKey, SnackbarProvider, useSnackbar } from "notistack";
import React, { createContext } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Auth/AuthProvider";
import { router } from "./router";
export const ErrorContext = createContext<Error | null>(null);

function App() {
  // https://mui.com/material-ui/customization/default-theme/
  const theme = createTheme({
    palette: {
      mode: "dark",
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
            backgroundColor: "#464e5a",
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
      MuiDialog: {
        styleOverrides: {
          paper: {
            overflowY: "visible",
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

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        retry: 3,
        refetchOnWindowFocus: false,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });

  const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
  });
  // const sessionStoragePersister = createSyncStoragePersister({ storage: window.sessionStorage })

  persistQueryClient({
    queryClient,
    persister: localStoragePersister,
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
              <RouterProvider router={router} />
            </ThemeProvider>
          </SnackbarProvider>
        </QueryClientProvider>
      </React.StrictMode>
    </AuthProvider>
  );
}

export default App;
