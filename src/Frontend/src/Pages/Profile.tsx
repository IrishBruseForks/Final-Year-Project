import { Paper, Stack, Typography } from "@mui/material";
import Navbar from "../Components/Navbar";

function ProfilePage() {
  return (
    <Stack sx={{ minHeight: "100vh", maxHeight: "100vh", color: "inherit" }}>
      <Navbar toggleDrawer={() => {}} enableBurgerMenu={false} />

      <Paper sx={{ minHeight: "60vh", bgcolor: "background.paper", minWidth: { md: "40%" }, margin: { md: "auto" }, p: 3 }}>
        <Stack direction="column" alignItems={"center"} spacing={2} sx={{ mb: 2 }}>
          <Typography variant="h4">Profile</Typography>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default ProfilePage;
