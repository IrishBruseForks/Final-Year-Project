import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Box, IconButton, Menu, MenuItem, Paper, Stack, SwipeableDrawer, Toolbar, Typography, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import FriendsPanel from "../Components/FriendsPanel";
import Constants from "../Utility/Constants";
import Image from "../Components/Image";

function HomePage() {
  const [opened, setOpened] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const isMobile = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    document.title = Constants.AppName("Home");
    setProfilePicture(localStorage.getItem(Constants.ProfilePictureKey)!);
  }, []);

  const toggleDrawer = (state: boolean) => {
    setOpened(state);
  };

  return (
    <Box sx={{ height: "100vh" }}>
      <AppBar position="sticky">
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
            Photos
          </Typography>
          {true && (
            <div>
              <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" color="inherit">
                <Image src={profilePicture} title="Profile Picture" sx={{ height: "2rem", width: "2rem" }} />
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
          )}
        </Toolbar>
      </AppBar>
      <Grid container columnSpacing={2} sx={{ height: "100%" }}>
        {isMobile ? (
          // Mobile
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
        ) : (
          <Grid item md={3} sx={{ width: "100%" }}>
            <Paper sx={{ height: "100%" }}>
              <FriendsPanel></FriendsPanel>
            </Paper>
          </Grid>
        )}
        {/* Desktop */}
        <Grid item xs={12} md={9}>
          <Stack spacing={2} sx={{ height: "100%" }}>
            <Paper sx={{ height: "100%" }}>3</Paper>
            <Paper sx={{ height: "100%" }}>4</Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage;
