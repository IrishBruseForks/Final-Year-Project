import { Paper, Stack, SwipeableDrawer, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import FriendsPanel from "../Components/FriendsPanel";
import MessageHeader from "../Components/MessageArea/MessageHeader";
import MessageView from "../Components/MessageArea/MessageView";

function HomePage() {
  const isMobile = useMediaQuery("(max-width:899px)");
  const [opened, setOpened] = useState(false);

  const toggleDrawer = (state: boolean) => {
    setOpened(state);
  };

  // Effect for setting the document title and disabling body scroll
  useEffect(() => {
    document.title = import.meta.env.VITE_APP_TITLE + " - Home";
    // Disable body scroll
    document.body.style.overflow = "hidden";

    // Re-enable body scroll when component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <Stack sx={{ height: "100vh" }}>
      <MessageHeader toggleDrawer={toggleDrawer} />

      {isMobile && (
        <SwipeableDrawer
          anchor="left"
          open={opened}
          onOpen={() => {
            toggleDrawer(true);
          }}
          onClose={() => {
            toggleDrawer(false);
          }}
        >
          <Grid item sx={{ width: { xs: "75vw" } }}>
            <FriendsPanel />
          </Grid>
        </SwipeableDrawer>
      )}

      <Grid container columnSpacing={2} flexGrow={1}>
        {!isMobile && (
          <Grid item md={3} flexGrow={1}>
            <Paper sx={{ height: "100%" }}>
              <FriendsPanel />
            </Paper>
          </Grid>
        )}
        <MessageView />
      </Grid>
    </Stack>
  );
}

export default HomePage;
