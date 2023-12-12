import React, { useEffect, useState } from "react";
import { Grid, Box, Paper, Stack, TextField, Button, InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageList from "./MessageList";
import Urls from "../../Utility/Urls";
import axios from "axios";
import Constants from "../../Utility/Constants";
import useApi, { getConfig } from "../../Utility/useApi";
import { PostMessageBody, PostMessageResponse } from "../../Types/ServerTypes";
import { useParams } from "react-router-dom";

function MessageView() {
  const [messageText, setMessageText] = useState("");
  const { uuid } = useParams<{ uuid: string }>();

  const { data: messages } = useApi<PostMessageResponse[]>("getMessages", Urls.Messages+"?id="+uuid, { refetchInterval: 2000 });

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     const response = await axios.get(Constants.BackendUrl + Urls.Messages, getConfig());
  //     setMessages(response.data);
  //   };
  //   fetchMessages();
  // }, []);


  const handleSendMessage = async () => {
    if (messageText === "") return;
    if (!uuid) return;
    try {
      const newMessage: PostMessageBody = { content: messageText, channelId: uuid };
      await axios.post(Constants.BackendUrl + Urls.Messages, newMessage, getConfig());
      // setMessages([...messages, newMessage]);
    } catch (error) {
      console.log("Error sending Message:", error);
    }
  };

  return (
    <Grid item xs={12} md={9} pr={2}>
      <Stack spacing={2} sx={{ height: "100%" }}>
        <Paper sx={{ height: "100%" }}>
          <Box
            sx={{
              p: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "left",
              backgroundColor: "transparent",
              height: "100%",
            }}
          >
            <MessageList messages={messages} />
          </Box>
        </Paper>
        <Paper sx={{ height: "10%" }}>
          <TextField
            size="medium"
            autoFocus
            margin="dense"
            label="Message"
            fullWidth
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendMessage}>
                    Send
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Paper>
      </Stack>
    </Grid>
  );
}

export default MessageView;
