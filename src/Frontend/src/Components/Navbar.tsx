import { Menu as MenuIcon } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../Auth/useAuth";
import LazyImage from "./LazyImage";

function Navbar({ toggleDrawer }: { toggleDrawer: (open: boolean) => void }) {
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery("(max-width:899px)");
  const [opened, setOpened] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string>();

  const anchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setProfilePicture(user?.profilePicture);
  }, [user?.profilePicture]);

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
          <LazyImage src="./Icon_Big.png" sx={{ height: "3rem" }}></LazyImage>
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
            ref={anchorRef}
          >
            <LazyImage src={profilePicture} placeholder={<AccountCircleIcon />} title="Profile Picture" sx={{ height: 32, width: 32 }} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorRef.current}
            anchorOrigin={{
              vertical: "bottom",
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
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
