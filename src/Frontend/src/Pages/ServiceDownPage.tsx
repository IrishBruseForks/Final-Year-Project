import { Alert, Grid, LinearProgress, Stack } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Constants from "../Utility/Constants";

function ServiceDownPage() {
  const navigate = useNavigate();

  async function checkStatus() {
    try {
      await axios.get(Constants.BackendUrl + "/status");
      navigate("/");
    } catch (error) {
      // Catch error
    }
  }

  useEffect(() => {
    checkStatus();

    const interval = setInterval(async () => {
      // Check to see if the backend is running
      // if there is an exception redirect to service down page and keep retrying connection
      await checkStatus();
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack>
      <LinearProgress />
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "99vh" }}
      >
        <Alert variant="filled" severity="error">
          Error - Backend is currently not responding
        </Alert>
      </Grid>
    </Stack>
  );
}

export default ServiceDownPage;
