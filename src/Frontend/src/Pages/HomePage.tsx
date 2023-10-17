import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  SwipeableDrawer,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import FriendsPanel from "../Components/FriendsPanel";

function HomePage() {
  const [opened, setOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <Box sx={{ height: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
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
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                // onClick={}
                color="inherit"
              >
                <AccountCircle />
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
          <SwipeableDrawer
            open={opened}
            onOpen={() => setOpened(true)}
            onClose={() => setOpened(false)}
          >
            <FriendsPanel></FriendsPanel>
          </SwipeableDrawer>
        ) : (
          <FriendsPanel></FriendsPanel>
        )}
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
