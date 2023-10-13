import { Button, Grid } from "@mui/material";
import Google from "@mui/icons-material/Google";
import { useGoogleLogin } from "@react-oauth/google";
import { router } from '../main';

function LoginPage() {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });


  const navigateToHomePage = () => {
    router.navigate("/home");
  };

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

      
      <Grid item xs={3} sx={{ marginTop: "1rem" }}>
        <Button variant="outlined" onClick={navigateToHomePage}>
          Homepage
        </Button>
      </Grid>


    </Grid>
  );
}

export default LoginPage;
