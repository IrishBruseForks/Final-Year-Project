import ReplyIcon from "@mui/icons-material/Reply"; // For reply action
import { Avatar, Box, IconButton, ListItemButton, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import { ChannelResponse, PostMessageResponse } from "../../Types/ServerTypes";
import LazyImage from "../LazyImage";

interface MessageProps {
  message: PostMessageResponse;
  channel?: ChannelResponse;
  onReply?: (messageId: string, username: string) => void;
}

// Assuming onReply is passed as a prop for initiating a reply
function Message({ message, channel, onReply }: MessageProps) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [showActions, setShowActions] = useState(false);

  function getProfilePictureUrl(message: PostMessageResponse) {
    return channel?.users?.find((c) => c.id === message.sentBy)?.picture || "";
  }

  const handleMouseEnter = () => {
    if (!isMobile) {
      setShowActions(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setShowActions(false);
    }
  };

  const handleReplyClick = () => {
    if (onReply && channel) {
      const username = channel.users.find((c) => c.id === message.sentBy)?.username || "";
      onReply(message.channelId, username);
    }
  };

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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => isMobile && setShowActions(!showActions)}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Avatar src={getProfilePictureUrl(message)} sx={{ mr: 1 }} />
        <Box flexGrow={1}>
          <Typography variant="body2">{channel?.users?.find((c) => c.id === message.sentBy)?.username}</Typography>
          <Typography variant="body1">{message.content}</Typography>
        </Box>
      </Box>
      <LazyImage src={message.image} placeholder={<div />} sx={{ pl: 6 }} />
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
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        {showActions && (
          <Tooltip title="Reply" placement="top">
            <IconButton onClick={handleReplyClick} size="small">
              <ReplyIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </ListItemButton>
  );
}

export default Message;
