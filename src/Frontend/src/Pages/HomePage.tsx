import { Paper, Stack, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import FriendsPanel from "../Components/FriendsPanel";
import MessageHeader from "../Components/MessageArea/MessageHeader";
import MessageView from "../Components/MessageArea/MessageView";
import Constants from "../Utility/Constants";

function HomePage() {
  const isMobile = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    document.title = Constants.AppName("Home");
  }, []);

  return (
    <Stack sx={{ height: "100vh" }}>
      <MessageHeader />

      {!isMobile && (
        <Grid item md={3} sx={{ width: "100%" }}>
          <Paper sx={{ height: "100%" }}>
            <FriendsPanel></FriendsPanel>
          </Paper>
        </Grid>
      )}

      <Grid container columnSpacing={2} flexGrow={1}>
        <MessageView />
      </Grid>
    </Stack>
  );
}

export default HomePage;
