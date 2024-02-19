import Google from "@mui/icons-material/Google";
import { Button, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/useAuth";
import LazyImage from "../Components/LazyImage";
import { OAuth } from "../Types/ServerTypes";

function LoginPage(args: { signup?: boolean }) {
  const { login, user, signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (user && !user.signup) {
      navigate("/");
    }
    if (user?.signup) {
      navigate("/signup");
    }
  }, [user]);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: OAuth) => {
      try {
        let loginResponse = await login(tokenResponse);

        if (loginResponse.signup) {
          navigate("/signup");
        } else {
          navigate("/");
        }
      } catch (e) {
        enqueueSnackbar("Login failed: " + e, { variant: "error" });
      }
    },
    onError: (error) => {
      enqueueSnackbar("Error: " + error);
    },
    flow: "auth-code",
  });

  const validateUsername = useMemo(() => {
    if (username == null) {
      return false;
    }

    if (username == "") {
      return true;
    }

    if (username.match(/^[a-zA-Z0-9_]+$/) == null) {
      return true;
    }

    return username.length < 3 || username.length > 20;
  }, [username]);

  useEffect(() => {
    document.title = import.meta.env.VITE_APP_TITLE + " - Login";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signupCallback() {
    if (!username) {
      return;
    }
    try {
      await signup(username);
      navigate("/");
    } catch (error) {}
  }

  return (
    <Stack direction={"column"} alignItems={"center"} sx={{ minHeight: "100vh", pt: 8 }}>
      <LazyImage src="./Logo.png" title="Logo" sx={{ width: "24rem", height: "24rem" }} />
      <Typography variant="h2" align="center" sx={{ mb: 2, mt: 2 }}>
        {import.meta.env.VITE_APP_TITLE}
      </Typography>

      {!args.signup ? (
        <Typography sx={{ mb: 8, maxWidth: "400px" }}>The catalyst to all your messaging needs</Typography>
      ) : (
        <Typography sx={{ mb: 8, maxWidth: "400px" }}>Please provide a username others will use to add you as a friend</Typography>
      )}

      {args.signup ? (
        <Stack direction={"column"} gap={2}>
          <TextField
            id="username"
            label="Username"
            error={validateUsername}
            InputProps={{
              startAdornment: <InputAdornment position="start">@</InputAdornment>,
            }}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button variant="contained" disabled={username == null || validateUsername} onClick={signupCallback}>
            <b>Signup</b>
          </Button>
        </Stack>
      ) : (
        <Button variant="contained" onClick={googleLogin}>
          Login With Google <Google sx={{ margin: "0 0 0 0.5rem" }} />
        </Button>
      )}
    </Stack>
  );
}

export default LoginPage;
