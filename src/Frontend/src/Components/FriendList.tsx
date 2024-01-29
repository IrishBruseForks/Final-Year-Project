import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, IconButton, Menu, MenuItem, Stack, Toolbar, Typography, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useAuth } from "../Auth/useAuth";
import LazyImage from "./LazyImage";
import MessageView from "./Messages/MessageView";

function FriendList() {
  const { user } = useAuth();
  const [opened, setOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width:899px)");

  useEffect(() => {
    document.title = import.meta.env.VITE_APP_TITLE + " - Home";
  }, []);

  const toggleDrawer = (state: boolean) => {
    setOpened(state);
  };

  return (
    <Stack>
      <AppBar position="relative">
        <Toolbar>
          {isMobile && (
            <IconButton
              onClick={() => {
                toggleDrawer(true);
              }}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chatalyst
          </Typography>
          <div>
            <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" color="inherit">
              <LazyImage src={user?.profilePicture} title="Profile Picture" sx={{ height: 32, width: 32 }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              // anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={opened}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>My account</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Grid container columnSpacing={2} sx={{ maxHeight: "100%" }}>
        <MessageView />
      </Grid>
    </Stack>
  );
}

export default FriendList;
