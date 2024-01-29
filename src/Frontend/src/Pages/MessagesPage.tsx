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
    <Stack sx={{ minHeight: "100vh", maxHeight: "100vh" }}>
      <Navbar toggleDrawer={toggleDrawer} />
      <Stack direction={"row"} flexGrow={1} sx={{ height: "100%" }}>
        <MobileSwitch
          mobile={
            <SwipeableDrawer anchor="left" open={opened} onClose={() => toggleDrawer(false)} onOpen={() => toggleDrawer(true)}>
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
