import Google from "@mui/icons-material/Google";
import { Button, Stack, Typography } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/useAuth";
import LazyImage from "../Components/LazyImage";
import { OAuth } from "../Types/ServerTypes";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: OAuth) => {
      await login(tokenResponse);
      navigate("/");
    },
    onError: (error) => {
      enqueueSnackbar("Error: " + error);
    },
    flow: "auth-code",
  });

  useEffect(() => {
    document.title = import.meta.env.VITE_APP_TITLE + " - Login";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack direction={"column"} alignItems={"center"} sx={{ minHeight: "100vh", pt: 8 }}>
      <LazyImage src="./Logo.png" title="Logo" sx={{ width: "24rem", height: "24rem" }} />

      <Typography variant="h2" align="center" sx={{ mb: 2, mt: 2 }}>
        {import.meta.env.VITE_APP_TITLE}
      </Typography>
      <Typography sx={{ mb: 8 }}>The catalyst to all your messaging needs</Typography>
      <Button variant="contained" onClick={googleLogin}>
        Login With Google <Google sx={{ margin: "0 0 0 0.5rem" }} />
      </Button>
    </Stack>
  );
}

export default LoginPage;
