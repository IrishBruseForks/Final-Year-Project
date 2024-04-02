import { Stack, SwipeableDrawer, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FriendsPanel from "../Components/FriendsPanel";
import MessageView from "../Components/Messages/MessageView";
import MobileSwitch from "../Components/MobileSwitch";
import Navbar from "../Components/Navbar";

function MessagesPage() {
  const { uuid } = useParams<{ uuid: string }>(); // Get the 'uuid' from the URL parameters

  const [opened, setOpened] = useState(false);
  const toggleDrawer = (state: boolean) => {
    setOpened(state);
  };

  // Effect for setting the document title and disabling body scroll
  useEffect(() => {
    document.title = import.meta.env.VITE_APP_TITLE + " - Home";
  }, []);
  return (
    <Stack sx={{ minHeight: "100vh", maxHeight: "100vh", color: "inherit" }}>
      <Navbar toggleDrawer={toggleDrawer} />
      <Stack direction={"row"} flexGrow={1} sx={{ height: "100%" }}>
        <MobileSwitch
          mobile={
            <SwipeableDrawer
              anchor="left"
              open={opened}
              onClose={() => toggleDrawer(false)}
              onOpen={() => toggleDrawer(true)}
              PaperProps={{
                sx: {
                  bgcolor: "background.paper", // Ensure consistency
                  width: "80vw", // Optional: Adjust the drawer width
                  // Any additional styling
                },
              }}
            >
              <FriendsPanel close={() => toggleDrawer(false)} />
            </SwipeableDrawer>
          }
          desktop={<FriendsPanel />}
        />

        {uuid == undefined ? (
          <Stack
            flexBasis={0}
            justifyContent={"center"}
            alignItems={"center"}
            flexGrow={1}
            p={1.5}
            sx={{ m: { xs: 1, md: 2 } }}
            borderRadius={1}
            bgcolor="background.paper"
          >
            <Typography>Start by creating or opening a channel</Typography>
          </Stack>
        ) : (
          <MessageView />
        )}
      </Stack>
    </Stack>
  );
}

export default MessagesPage;
