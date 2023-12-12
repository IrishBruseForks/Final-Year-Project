import { Alert, Grid, LinearProgress, Stack } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Urls from "../Utility/Urls";
import useApi from "../Utility/useApi";

function ServiceDownPage() {
  const navigate = useNavigate();

  const { isSuccess, isError: serverFailed } = useApi("getStatusGlobal", Urls.Status);

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

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
