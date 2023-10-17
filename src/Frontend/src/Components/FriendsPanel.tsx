import { Avatar, Box, Grid, Stack, Typography } from "@mui/material";
import ChatItem from "./ChatItem";

function FriendsPanel() {
  return (
    <Grid item xs={12} md={3} sx={{ width: { xs: "75vw" } }}>
      <Stack direction={"column"} spacing={1}>
        {["Ryan", "Ethan", "Conor", "Emma", "Spongebob", "Ash"].map((name) => (
          <ChatItem username={name}></ChatItem>
        ))}
      </Stack>
    </Grid>
  );
}

export default FriendsPanel;

// userID
//username
//picture
