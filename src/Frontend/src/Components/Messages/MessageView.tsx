import GroupsIcon from "@mui/icons-material/Groups";
import SendIcon from "@mui/icons-material/Send";
import { Avatar, Box, Button, IconButton, InputAdornment, List, ListItemButton, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth";
import { ChannelResponse, PostMessageBody, PostMessageResponse } from "../../Types/ServerTypes";
import Urls from "../../Utility/Urls";
import { getApiConfig, useApi } from "../../Utility/useApi";
import LazyImage from "../LazyImage";

function MessageView() {
  const { uuid } = useParams<{ uuid: string }>();
  const { data: messages } = useApi<PostMessageResponse[]>(["getMessages", uuid], Urls.Messages + "?id=" + uuid, { refetchInterval: 5000 });
  const { user } = useAuth();
  const { data: channel } = useApi<ChannelResponse>(["getChannel", uuid], Urls.Channel + "?id=" + uuid);

  const handleKeyDown = (event: { key: string; preventDefault: () => void }) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (messageText === "") return;
    if (!uuid) return;
    if (!user) return;

    try {
      const newMessage: PostMessageBody = { content: messageText, channelId: uuid };
      await axios.post(import.meta.env.VITE_API_URL + Urls.Messages, newMessage, getApiConfig(user));
    } catch (error) {
      console.log("Error sending Message:", error);
      enqueueSnackbar(error as any);
    } finally {
      setMessageText("");
    }
  };

  const [messageText, setMessageText] = useState("");

  const getProfilePictureUrl = (message: PostMessageResponse) => {
    return (
      channel?.users?.find((c) => {
        return c.id === message.sentBy;
      })?.picture || ""
    );
  };

  return (
    <Stack flexBasis={0} flexGrow={1} p={1.5} sx={{ m: { xs: 1, md: 2 } }} borderRadius={1} bgcolor="background.paper">
      <Box sx={{ borderBottom: 1, display: "flex", alignItems: "center" }}>
        <Typography sx={{ textAlign: "justify" }} variant="h5">
          <IconButton>
            <LazyImage src={channel?.picture} title="Profile Picture" sx={{ height: 32, width: 32, borderRadius: "50%" }} placeholder={<GroupsIcon />} />
          </IconButton>
          {channel?.name}
        </Typography>
      </Box>
      <List
        sx={{
          px: { xs: 0, md: 1 },
          flex: "1 1 auto",
          display: "flex",
          overflowY: "auto",
          height: "0px",
          flexDirection: "column-reverse",
        }}
      >
        {messages?.map((message) => (
          <ListItemButton key={message.sentOn} sx={{ display: "flex", alignItems: "start", mb: 1, borderRadius: 1 }}>
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
        ))}
      </List>
      <TextField
        size="medium"
        autoFocus
        margin="dense"
        label="Message"
        fullWidth
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={handleKeyDown} // Attach the handleKeyDown function here
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendMessage} sx={{ color: "text.primary" }}>
                <b>Send</b>
              </Button>
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}

export default MessageView;
