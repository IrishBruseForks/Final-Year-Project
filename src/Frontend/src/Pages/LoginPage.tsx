import { Button, Grid } from "@mui/material";
import Google from "@mui/icons-material/Google";
import { useGoogleLogin } from "@react-oauth/google";

function LoginPage() {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item xs={3}>
        <Button variant="outlined" onClick={() => login()}>
          Login With Google <Google sx={{ margin: "0 0 0 0.5rem" }} />
        </Button>
      </Grid>
    </Grid>
  );
}

export default LoginPage;
