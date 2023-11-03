import { Alert, Grid, LinearProgress, Stack } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Utility/Api";

function ServiceDownPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        await Api.Status();
        navigate("/");
      } catch (error) {
        // Catch Error
      }
    };

    checkStatus();

    // Check to see if the backend is running
    // if there is an exception redirect to service down page and keep retrying connection
    const interval = setInterval(() => {
      checkStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <Stack>
      <LinearProgress />
      <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: "99vh" }}>
        <Alert variant="filled" severity="error">
          Error - Backend is currently not responding
        </Alert>
      </Grid>
    </Stack>
  );
}

export default ServiceDownPage;
