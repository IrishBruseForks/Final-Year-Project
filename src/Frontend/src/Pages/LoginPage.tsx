import { Button, Stack, Typography } from "@mui/material";
import Google from "@mui/icons-material/Google";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "../Components/Image";
import Constants from "../Utility/Constants";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const resp = await axios.post(Constants.BackendUrl + "/oauth2/google", {
        code: tokenResponse.code,
      });
      console.log(resp.data);
    },
    onError: (error) => {
      console.error(error);
    },
    flow: "auth-code",
  });

  const navigateToHomePage = () => {
    navigate("/home");
  };
  useEffect(() => {
    document.title = Constants.AppName("Login");
  }, []);

  return (
    <Stack
      direction={"column"}
      alignItems={"center"}
      sx={{ minHeight: "100vh", pt: 8 }}
    >
      {" "}
      <Image eager src="./Logo.png" alt="Logo" width="24rem" height="24rem" />
      <Typography variant="h2" align="center" sx={{ mb: 2, mt: 2 }}>
        {Constants.AppName()}
      </Typography>
      <Typography sx={{ mb: 8 }}>
        The catalyst to all your messaging needs
      </Typography>
      <Button variant="outlined" onClick={navigateToHomePage}>
        Homepage
      </Button>
      <Button variant="contained" onClick={() => login()}>
        Login With Google <Google sx={{ margin: "0 0 0 0.5rem" }} />
      </Button>
    </Stack>
  );
}

export default LoginPage;
