import Google from "@mui/icons-material/Google";
import { Button, Stack, Typography } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LazyImage from "../Components/LazyImage";
import { OAuth, OAuthResponse } from "../Types/ServerTypes";
import Constants from "../Utility/Constants";

function LoginPage() {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse: OAuth) => {
      const resp = (await axios.post(Constants.BackendUrl + "auth/google", { code: tokenResponse.code })).data as OAuthResponse;

      localStorage.setItem(Constants.AccessTokenKey, resp.token);
      localStorage.setItem(Constants.ProfilePictureKey, resp.profilePicture);

      navigate("/");
    },
    onError: (error) => {
      enqueueSnackbar("Error: " + error, { variant: "error" });
    },
    flow: "auth-code",
  });

  useEffect(() => {
    document.title = Constants.AppName + " - Login";

    if (localStorage.getItem(Constants.AccessTokenKey) !== null) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack direction={"column"} alignItems={"center"} sx={{ minHeight: "100vh", pt: 8 }}>
      <LazyImage src="./Logo.png" title="Logo" sx={{ width: "24rem", height: "24rem" }} placeholder={null} />

      <Typography variant="h2" align="center" sx={{ mb: 2, mt: 2 }}>
        {Constants.AppName}
      </Typography>
      <Typography sx={{ mb: 8 }}>The catalyst to all your messaging needs</Typography>
      <Button variant="contained" onClick={login}>
        Login With Google <Google sx={{ margin: "0 0 0 0.5rem" }} />
      </Button>
    </Stack>
  );
}

export default LoginPage;
