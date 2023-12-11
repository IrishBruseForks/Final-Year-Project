import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from "@mui/material";

import { useEffect, useState } from "react";
import Constants from "../../Utility/Constants";
import LazyImage from "../LazyImage";

function MessageHeader({ toggleDrawer }: { toggleDrawer: (open: boolean) => void }) {
  const isMobile = useMediaQuery("(max-width:899px)");
  const [opened, setOpened] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string>("");

  useEffect(() => {
    setProfilePicture(localStorage.getItem(Constants.ProfilePictureKey)!);
  }, []);

  return (
    <>
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
          <IconButton
            onClick={() => setOpened(true)}
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
          >
            <LazyImage src={profilePicture} title="Profile Picture" sx={{ height: 32, width: 32 }} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={null}
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
            onClose={() => {
              setOpened(false);
            }}
          >
            <MenuItem>Profile</MenuItem>
            <MenuItem
              onClick={() => {
                localStorage.removeItem(Constants.AccessTokenKey);
                localStorage.removeItem(Constants.ProfilePictureKey);
                window.location.reload();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default MessageHeader;
