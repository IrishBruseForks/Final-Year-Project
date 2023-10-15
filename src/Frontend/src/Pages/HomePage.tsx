import { Box, Paper, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";

function HomePage() {
  return (
    <Box sx={{ height: "100vh" }}>
      <Grid container columnSpacing={2} sx={{ height: "100%" }}>
        <Grid item xs={12} md={3}>
          <Stack spacing={2} sx={{ height: "100%", pb: { xs: 2, md: 0 } }}>
            <Paper sx={{ height: "100%" }}>1</Paper>
            <Paper sx={{ height: "100%" }}>2</Paper>
          </Stack>
        </Grid>
        <Grid item xs={12} md={9}>
          <Stack spacing={2} sx={{ height: "100%" }}>
            <Paper sx={{ height: "100%" }}>3</Paper>
            <Paper sx={{ height: "100%" }}>4</Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage;
