import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Avatar, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { useRef, useState } from "react";
import { useAuth } from "../Auth/useAuth";
import { Profile } from "../Types/ServerTypes";
import Urls from "../Utility/Urls";
import { useApi } from "../Utility/useApi";
import LazyImage from "./LazyImage";
import ProfileModal from "./Modals/ProfileModal";

function Navbar({ toggleDrawer, enableBurgerMenu = true }: { toggleDrawer: (open: boolean) => void; enableBurgerMenu?: boolean }) {
  const { logout } = useAuth();
  const { data: whoami } = useApi<Profile>("profile", Urls.Profile, {});

  const isMobile = useMediaQuery("(max-width:899px)");
  const [opened, setOpened] = useState<boolean>(false);

  const anchorRef = useRef<HTMLButtonElement>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  function profile() {
    setIsProfileModalOpen(true);
    setOpened(false);
  }

  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          {isMobile && enableBurgerMenu && (
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
          <LazyImage src="./Icon_Big.png" sx={{ height: "3rem", pr: 3 }}></LazyImage>
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
            <Avatar src={whoami?.picture} title="Profile Picture" sx={{ bgcolor: "background.default", borderRadius: "50%", height: 32, width: 32 }} />
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
            <MenuItem onClick={profile}>Profile</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <ProfileModal open={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
}

export default Navbar;
