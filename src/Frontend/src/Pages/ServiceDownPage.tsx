import { Alert, Grid, LinearProgress, Stack } from "@mui/material";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import Urls from "../Utility/Urls";
import useApi from "../Utility/useApi";

function ServiceDownPage() {
  const navigate = useNavigate();

  const client = useQueryClient();

  const { isSuccess } = useApi("getStatusGlobal", Urls.Status);

  useEffect(() => {
    if (isSuccess) {
      console.log("Redirecting to home page from service down page");

      client.invalidateQueries("getLogin");
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

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
