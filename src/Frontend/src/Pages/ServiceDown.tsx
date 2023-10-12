import { ErrorOutline } from "@mui/icons-material";
import { CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Centered from "../Components/Centered";
import Urls from "../Utility/Urls";

function ServiceDownPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await axios.get(Urls.backendUrl + "/status", { timeout: 5000 });
        navigate("/");
      } catch (error: unknown) {
        console.error(error);
      }
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Centered>
      <ErrorOutline color="error"></ErrorOutline>
      <Typography align="center">Backend is currently Unreachable</Typography>
      <Typography align="center">Retrying</Typography>
      <CircularProgress />
    </Centered>
  );
}

export default ServiceDownPage;
