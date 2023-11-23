import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Grid, IconButton, Menu, MenuItem, SwipeableDrawer, Toolbar, Typography, useMediaQuery } from "@mui/material";

import { useEffect, useState } from "react";
import Constants from "../../Utility/Constants";
import FriendsPanel from "../FriendsPanel";
import Image from "../Image";

function MessageHeader() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [opened, setOpened] = useState(false);

  const toggleDrawer = (state: boolean) => {
    setOpened(state);
  };

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
          <div>
            <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" color="inherit">
              <Image src={profilePicture} title="Profile Picture" sx={{ height: 32, width: 32 }} />
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
              open={Boolean(false)}
              // onClose={handleClose}
            >
              <MenuItem
              // onClick={handleClose}
              >
                Profile
              </MenuItem>
              <MenuItem
              // onClick={handleClose}
              >
                My account
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

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
    </>
  );
}

export default MessageHeader;
