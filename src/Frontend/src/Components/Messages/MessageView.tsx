import GroupsIcon from "@mui/icons-material/Groups";
import SendIcon from "@mui/icons-material/Send";
import UploadIcon from "@mui/icons-material/Upload";
import { Avatar, Box, Button, IconButton, InputAdornment, List, ListItemButton, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth";
import { ChannelResponse, PostMessageBody, PostMessageResponse } from "../../Types/ServerTypes";
import Urls from "../../Utility/Urls";
import { getApiConfig, useRefetchApi } from "../../Utility/useApi";
import LazyImage from "../LazyImage";

function MessageView() {
  const { uuid } = useParams<{ uuid: string }>();
  const { data: messages } = useRefetchApi<PostMessageResponse[]>(["getMessages", uuid], Urls.Messages + "?id=" + uuid, "Fetching messages", {
    refetchInterval: 5000,
  });
  const { user } = useAuth();
  const { data: channel } = useRefetchApi<ChannelResponse>(["getChannel", uuid], Urls.Channel + "?id=" + uuid, "Fetching channels");

  const handleSendMessage = async () => {
    if (messageText === "") return;
    if (!uuid) return;
    if (!user) return;

    try {
      const newMessage: PostMessageBody = { content: messageText, channelId: uuid };
      await axios.post(import.meta.env.VITE_API_URL + Urls.Messages, newMessage, getApiConfig(user));
      setMessageText("");
    } catch (error) {
      console.log("Error sending Message:", error);
      enqueueSnackbar(error as any);
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
      <Stack direction={"row"} display={"flex"} alignItems={"center"} justifyContent={"center"} gap={1}>
        <Box>
          <IconButton onClick={() => {}}>
            <UploadIcon />
          </IconButton>
        </Box>
        <TextField
          size="medium"
          autoFocus
          margin="dense"
          label="Message"
          autoComplete="on"
          multiline={true}
          maxRows={4}
          fullWidth
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (!e.shiftKey && e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
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
      </Stack>
    </Stack>
  );
}

export default MessageView;
