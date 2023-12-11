import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, IconButton, Menu, MenuItem, Stack, Toolbar, Typography, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import Constants from "../Utility/Constants";
import LazyImage from "./LazyImage";
import MessageView from "./MessageArea/MessageView";

function FriendList() {
  const [opened, setOpened] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const isMobile = useMediaQuery("(max-width:899px)");

  useEffect(() => {
    document.title = Constants.AppName + " - Home";
    setProfilePicture(localStorage.getItem(Constants.ProfilePictureKey)!);
  }, []);

  const toggleDrawer = (state: boolean) => {
    setOpened(state);
  };

  return (
    <Stack sx={{ height: "100vh" }}>
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
              <LazyImage src={profilePicture} title="Profile Picture" sx={{ height: 32, width: 32 }} />
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
      <Grid container columnSpacing={2} flexGrow={1}>
        <MessageView />
      </Grid>
    </Stack>
  );
}

export default FriendList;
