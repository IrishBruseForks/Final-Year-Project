import { Avatar, Box, Grid, Stack, Typography } from "@mui/material";
import ChatItem from "./ChatItem";
import { Message } from "@mui/icons-material";

function FriendsPanel() {
  return (
    <Grid item xs={12} md={3} sx={{ width: { xs: "75vw" } }}>
      <Stack direction={"column"} spacing={1}>
        {[
          {
            username: "Ryan",
            lastMessage: "Test",
            profilePic: "https://picsum.photos/200",
          },
          {
            username: "Ethan",
            lastMessage: "Test",
            profilePic: "https://picsum.photos/200",
          },
          {
            username: "Ash",
            lastMessage: "Gotta Catch 'Em All!",
            profilePic:
              "https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg",
          },
        ].map((user) => (
          <ChatItem
            username={user.username}
            lastMessage={user.lastMessage}
            profilePic={user.profilePic}
          ></ChatItem>
        ))}
      </Stack>
    </Grid>
  );
}

export default FriendsPanel;

// userID
//username
//picture
