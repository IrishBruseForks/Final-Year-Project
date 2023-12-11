import { Alert, Grid, LinearProgress, Stack } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Urls from "../Utility/Urls";
import useApi from "../Utility/useApi";

function ServiceDownPage() {
  const navigate = useNavigate();
  const { isError: serverDown } = useApi("getStatus", Urls.Status, null, { retry: (c, err) => c < 3 && (err as fet).response?.status !== 200 });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        await axios.get(Urls.Status);
        navigate("/");
      } catch (error) {
        // Catch Error
        navigate("/serviceDown");
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
