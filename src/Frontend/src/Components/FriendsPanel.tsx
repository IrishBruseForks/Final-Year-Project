import AddIcon from "@mui/icons-material/Add";
import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import ChatItem from "./ChatItem";

function FriendsPanel() {
  // Replacing this with API later
  const userArray = [
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
      profilePic: "https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg",
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <Typography variant="h6">Chats</Typography>
        <IconButton>
          <AddIcon />
        </IconButton>
      </Box>
      <Divider></Divider>
      <Stack direction={"column"} spacing={1}>
        {userArray.map((user) => (
          <ChatItem username={user.username} lastMessage={user.lastMessage} profilePic={user.profilePic} key={user.username}></ChatItem>
        ))}
      </Stack>
    </Box>
  );
}

export default FriendsPanel;

// userID
//username
//picture
