import { Avatar, Box, Divider, ListItemButton, Typography } from "@mui/material";

type Props = {
  username: string;
  lastMessage: string;
  profilePic: string;
};

function ChatItem({ username, lastMessage, profilePic }: Props) {
  return (
    <>
      <ListItemButton>
        <Box display={"grid"} alignItems={"center"} gridTemplateColumns={"1fr auto"}>
          {/* Profile picture (Avatar component can be used here) */}
          <Box gridRow={"span 2"}>
            <Avatar src={profilePic} alt="Profile Picture" sx={{ width: 60, height: 60, marginRight: 2 }} />
          </Box>

          {/* Name and other text stacked vertically */}
          <Typography noWrap variant="h6">
            {username}
          </Typography>
          <Typography noWrap color={"text.secondary"}>
            {lastMessage}
          </Typography>
        </Box>
      </ListItemButton>
      <Divider />
    </>
  );
}

export default ChatItem;
