import { Avatar, Box, ListItemButton, Typography } from "@mui/material";
import { format } from "date-fns";
import { ChannelResponse, PostMessageResponse } from "../../Types/ServerTypes";

function Message({ message, channel }: { message: PostMessageResponse; channel?: ChannelResponse }) {
  function getProfilePictureUrl(message: PostMessageResponse) {
    return (
      channel?.users?.find((c) => {
        return c.id === message.sentBy;
      })?.picture || ""
    );
  }

  return (
    <ListItemButton sx={{ flexGrow: 0, height: "min-content", display: "flex", alignItems: "start", mb: 1, borderRadius: 1 }}>
      <Avatar src={getProfilePictureUrl(message)} sx={{ mr: 1 }} />
      <Box width="100%">
        {/* {channel.users[0]} */}

        <Box display="flex" justifyContent={"space-between"}>
          <Typography variant="body2">
            {
              channel?.users?.find((c) => {
                return c.id === message.sentBy;
              })?.username
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" pr={"auto"}>
            {format(new Date(message.sentOn), "PPpp")}
          </Typography>
        </Box>

        <Typography variant="body1" textAlign={"justify"}>
          {message.content}
        </Typography>
      </Box>
    </ListItemButton>
  );
}

export default Message;
