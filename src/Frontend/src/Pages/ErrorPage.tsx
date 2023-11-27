import { ErrorOutline } from "@mui/icons-material";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const routeError = useRouteError() as Error;

  return (
    <Stack>
      <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: "100vh" }}>
        <Paper>
          <Box px={4} py={3}>
            <Grid container alignItems="center" justifyContent="center">
              <ErrorOutline color="error" />
              &nbsp;
              <Typography variant="h3" color="error">
                {routeError.name}
              </Typography>
            </Grid>
            <Typography variant="body1" color="error" align="center" my={2}>
              {routeError.message}
            </Typography>
            <Box>
              {routeError.stack
                ?.split("\n")
                .slice(1)
                .filter((line) => line.includes("node_modules/.vite/") == false)
                .map((line) => {
                  const parts = line.split("(");
                  const link = parts[1].slice(0, parts[1].length - 1);
                  return (
                    <Typography variant="body2" align="left" color="error">
                      {parts[0]}
                      <a href={link} style={{ color: "white" }}>
                        {link}
                      </a>
                    </Typography>
                  );
                })}
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Stack>
  );
}

export default ErrorPage;
