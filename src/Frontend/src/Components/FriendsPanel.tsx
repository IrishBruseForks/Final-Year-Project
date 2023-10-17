import {
  Avatar,
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  useRadioGroup,
} from "@mui/material";
import { useRouteId } from "react-router/dist/lib/hooks";
import Image from "./Image";

function FriendsPanel() {
  return (
    <Grid item xs={12} md={3} sx={{ width: { xs: "75vw" } }}>
      <Box sx={{ p: 2 }}>
        {" "}
        {/* Add padding or any other Box styling if needed */}
        <Paper
          elevation={3}
          sx={{ p: 2, display: "flex", alignItems: "center" }}
        >
          {/* Profile picture (Avatar component can be used here) */}
          <Avatar
            src=""
            alt="Profile Picture"
            sx={{ width: 60, height: 60, marginRight: 2 }}
          />

          {/* Name and other text stacked vertically */}
          <Stack direction="column" spacing={1}>
            <Typography variant="h6">Name Here</Typography>
            <Typography variant="body2">Other Text Here</Typography>
          </Stack>
        </Paper>
      </Box>
    </Grid>
  );
}

export default FriendsPanel;

// userID
//username
//picture
