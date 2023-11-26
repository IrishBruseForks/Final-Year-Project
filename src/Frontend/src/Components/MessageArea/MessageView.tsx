import { Grid, Paper, Stack } from "@mui/material";

function MessageView() {
  return (
    <Grid item xs={12} md={9} pr={2}>
      <Stack spacing={2} sx={{ height: "100%" }}>
        <Paper sx={{ height: "100%" }}></Paper>
        <Paper sx={{ height: "10%" }}></Paper>
      </Stack>
    </Grid>
  );
}

export default MessageView;
