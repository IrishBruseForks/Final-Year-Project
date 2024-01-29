import { Stack, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import FriendsPanel from "../Components/FriendsPanel";
import MessageView from "../Components/Messages/MessageView";
import Navbar from "../Components/Navbar";

function MessagesPage() {
  const isMobile = useMediaQuery("(max-width:899px)");
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
      <Stack direction={"row"} flexGrow={1}>
        {!isMobile && <FriendsPanel />}
        <MessageView />
      </Stack>
    </Stack>
  );
}

export default MessagesPage;
