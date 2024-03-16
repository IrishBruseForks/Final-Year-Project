import { Avatar, Box, ListItemButton, Typography } from "@mui/material";
import { format } from "date-fns";
import { ChannelResponse, PostMessageResponse } from "../../Types/ServerTypes";
import LazyImage from "../LazyImage";

interface MessageProps {
  message: PostMessageResponse;
  channel?: ChannelResponse;
}

// Assuming onReply is passed as a prop for initiating a reply
function Message({ message, channel }: MessageProps) {
  function getProfilePictureUrl(message: PostMessageResponse) {
    return channel?.users?.find((c) => c.id === message.sentBy)?.picture || "";
  }

  return (
    <ListItemButton
      sx={{
        flexGrow: 0,
        display: "flex",
        flexDirection: "column", // Stack content vertically
        justifyContent: "space-between", // Pushes content to the top and reply button to the bottom
        alignItems: "flex-start",
        mb: 1,
        borderRadius: 1,
        position: "relative", // Ensure the container is positioned relatively
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Avatar src={getProfilePictureUrl(message)} sx={{ mr: 1 }} />
        <Box flexGrow={1}>
          <Typography variant="body2">{channel?.users?.find((c) => c.id === message.sentBy)?.username}</Typography>
          <Typography variant="body1">{message.content}</Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 6 }}>
        <LazyImage
          src={message.image}
          placeholder={<div />}
          sx={{ maxHeight: "20rem", maxWidth: "100%", cursor: "zoom-in" }}
          onClick={() => {
            window.open(message.image);
          }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute", // Position the timestamp absolutely
          top: 0, // Align to the top of the container
          right: 0, // Align to the right of the container
          padding: 1, // Add some padding for spacing
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {format(new Date(message.sentOn), "PPpp")}
        </Typography>
      </Box>
    </ListItemButton>
  );
}

export default Message;
