import { Paper, Stack, SwipeableDrawer, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FriendsPanel from "../Components/FriendsPanel";
import MessageHeader from "../Components/MessageArea/MessageHeader";
import MessageView from "../Components/MessageArea/MessageView";
import Constants from "../Utility/Constants";

function HomePage() {
  const isMobile = useMediaQuery("(max-width:899px)");

  const [opened, setOpened] = useState(false);

  const { uuid } = useParams<{ uuid: string }>();

  console.log(uuid);

  const toggleDrawer = (state: boolean) => {
    setOpened(state);
  };
  useEffect(() => {
    document.title = Constants.AppName("Home");
  }, []);

  return (
    <Stack sx={{ height: "100vh" }}>
      <MessageHeader toggleDrawer={toggleDrawer} />

      {isMobile && (
        <SwipeableDrawer
          anchor="left"
          open={opened}
          onOpen={() => {
            console.log("open");
            toggleDrawer(true);
          }}
          onClose={() => {
            console.log("close");
            toggleDrawer(false);
          }}
        >
          <Grid item sx={{ width: { xs: "75vw" } }}>
            <FriendsPanel></FriendsPanel>
          </Grid>
        </SwipeableDrawer>
      )}

      <Grid container columnSpacing={2} flexGrow={1}>
        {!isMobile && (
          <Grid item md={3} flexGrow={1}>
            <Paper sx={{ height: "100%" }}>
              <FriendsPanel></FriendsPanel>
            </Paper>
          </Grid>
        )}
        <MessageView />
      </Grid>
    </Stack>
  );
}

export default HomePage;
