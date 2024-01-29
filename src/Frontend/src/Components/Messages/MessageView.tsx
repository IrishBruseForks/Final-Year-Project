import GroupsIcon from "@mui/icons-material/Groups";
import SendIcon from "@mui/icons-material/Send";
import { Avatar, Box, Button, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth";
import { ChannelResponse, PostMessageBody, PostMessageResponse } from "../../Types/ServerTypes";
import Urls from "../../Utility/Urls";
import useApi, { getConfig } from "../../Utility/useApi";
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
      await axios.post(import.meta.env.VITE_API_URL + Urls.Messages, newMessage, getConfig(user));
    } catch (error) {
      console.log("Error sending Message:", error);
      enqueueSnackbar(error as any, { variant: "error" });
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
    <Stack flexGrow={1} p={2}>
      <Box sx={{ borderBottom: 1, display: "flex", alignItems: "center" }}>
        <Typography sx={{ alignSelf: "center" }} variant="h5">
          <IconButton>
            <LazyImage src={channel?.picture} title="Profile Picture" sx={{ height: 32, width: 32 }} placeholder={<GroupsIcon />} />
          </IconButton>
          {channel?.name}
        </Typography>
      </Box>
      <Stack
        sx={{
          flex: "1 1 auto",
          overflowY: "auto",
          height: "0px", // CSS makes no sense
          flexDirection: "column-reverse",
        }}
      >
        {messages?.map((message) => (
          <Box key={message.sentOn} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar src={getProfilePictureUrl(message)} sx={{ mr: 1 }} />
            <Box>
              {/* {channel.users[0]} */}
              <Typography variant="body2">
                {
                  channel?.users?.find((c) => {
                    return c.id === message.sentBy;
                  })?.username
                }
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(message.sentOn), "PPpp")}
              </Typography>
              <Typography variant="body1">{message.content}</Typography>
            </Box>
          </Box>
        ))}
      </Stack>
      <Paper>
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
                <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendMessage}>
                  <b>Send</b>
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Paper>
    </Stack>
  );
}

export default MessageView;
