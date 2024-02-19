import { Stack, SwipeableDrawer } from "@mui/material";
import { useEffect, useState } from "react";
import FriendsPanel from "../Components/FriendsPanel";
import MessageView from "../Components/Messages/MessageView";
import MobileSwitch from "../Components/MobileSwitch";
import Navbar from "../Components/Navbar";

function MessagesPage() {
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
              <FriendsPanel />
            </SwipeableDrawer>
          }
          desktop={<FriendsPanel />}
        />
        <MessageView />
      </Stack>
    </Stack>
  );
}

export default MessagesPage;
