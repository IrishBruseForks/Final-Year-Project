import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar, Box, IconButton, ListItemButton, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import * as linkify from "linkifyjs";
import { useMemo, useState } from "react";
import * as sanitizeHtml from "sanitize-html";
import { ChannelResponse, OAuthResponse, PostMessageResponse } from "../../Types/ServerTypes";
import LazyImage from "../LazyImage";

interface MessageProps {
  message: PostMessageResponse;
  channel?: ChannelResponse;
  onDelete?: (messageId: string) => void;
}

const contentStyle = { a: { color: "primary.main" }, "a:visited": { color: "primary.dark" } };

// Assuming onReply is passed as a prop for initiating a reply
function Message({ message, channel, onDelete }: MessageProps) {
  function getProfilePictureUrl(message: PostMessageResponse) {
    return channel?.users?.find((c) => c.id === message.sentBy)?.picture || "";
  }

  // Retrieve current user from localStorage
  const currentUserJson = localStorage.getItem("user");
  const currentUser = currentUserJson ? (JSON.parse(currentUserJson) as OAuthResponse) : null;

  // Determine if the current user is the sender of the message
  const userCanDeleteMessage = currentUser?.id === message.sentBy;
  const [videos, setVideos] = useState<string[]>([]);

  const content = useMemo(() => {
    const links = linkify.find(message.content);

    let content = message.content;

    for (var i = links.length; i >= 0; i--) {
      const link = links[i];
      if (link) {
        const { href, type } = link;
        if (type === "url") {
          if (href.startsWith("https://www.youtube.com/watch?v=")) {
            setVideos((videos) => [...videos, href.replace("https://www.youtube.com/watch?v=", "")]);
          }
          content = content.replace(href, `<a href="${href}" target="_blank">${href}</a>`);
        }
      }
    }
    console.log(content);

    return sanitizeHtml(content, { allowedTags: ["a"], allowedAttributes: { a: ["href"] } });
  }, [message.content]);

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
          <Typography variant="body1" sx={contentStyle} dangerouslySetInnerHTML={{ __html: content }}></Typography>
        </Box>
      </Box>
      <Stack spacing={2} direction={"column"} sx={{ ml: 6 }}>
        <LazyImage
          src={message.image}
          placeholder={<div />}
          sx={{ maxHeight: "20rem", maxWidth: "100%", cursor: "zoom-in" }}
          onClick={() => {
            window.open(message.image);
          }}
        />
        {videos.length > 0 &&
          videos.map((video) => (
            <iframe
              src={"https://www.youtube.com/embed/" + video}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ))}
      </Stack>
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
      {onDelete && userCanDeleteMessage && (
        <IconButton aria-label="delete" size="small" onClick={() => onDelete(message.id)} sx={{ position: "absolute", bottom: "5px", right: "5px" }}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      )}
    </ListItemButton>
  );
}

export default Message;
