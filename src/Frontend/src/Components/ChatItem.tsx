import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";

type Props = {
  username: string;
  lastMessage: string;
  profilePic: string;
};

function ChatItem({ username, lastMessage, profilePic }: Props) {
  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      {/* Profile picture (Avatar component can be used here) */}
      <Avatar src={profilePic} alt="Profile Picture" sx={{ width: 60, height: 60, marginRight: 2 }} />

      {/* Name and other text stacked vertically */}
      <Stack direction="column" spacing={1}>
        <Typography variant="h5">{username}</Typography>
        <Typography>{lastMessage}</Typography>
      </Stack>
      <Divider />
    </Box>
  );
}

export default ChatItem;
