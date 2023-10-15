import { Alert, Grid, Stack } from "@mui/material";

function ErrorPage() {
  return (
    <Stack>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "99vh" }}
      >
        <Alert variant="filled" severity="error">
          Error 404 - Page not found
        </Alert>
      </Grid>
    </Stack>
  );
}

export default ErrorPage;
