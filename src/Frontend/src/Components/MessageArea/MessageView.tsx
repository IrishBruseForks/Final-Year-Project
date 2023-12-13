import SendIcon from "@mui/icons-material/Send";
import { Box, Button, Grid, InputAdornment, Paper, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { PostMessageBody, PostMessageResponse } from "../../Types/ServerTypes";
import Constants from "../../Utility/Constants";
import Urls from "../../Utility/Urls";
import useApi, { getConfig } from "../../Utility/useApi";
import MessageList from "./MessageList";

function MessageView() {
  const [messageText, setMessageText] = useState("");
  const { uuid } = useParams<{ uuid: string }>();

  const { data: apiMessages } = useApi<PostMessageResponse[]>(["getMessages", uuid], Urls.Messages + "?id=" + uuid, { refetchInterval: 5000 });

  const messages = useMemo(() => {
    if (apiMessages === undefined) return [];
    return apiMessages.map((message) => {
      return message;
    });
  }, [apiMessages]);

  const handleSendMessage = async () => {
    if (messageText === "") return;
    if (!uuid) return;
    try {
      const newMessage: PostMessageBody = { content: messageText, channelId: uuid };
      await axios.post(Constants.BackendUrl + Urls.Messages, newMessage, getConfig());
    } catch (error) {
      console.log("Error sending Message:", error);
    } finally {
      setMessageText("");
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
                    <b>Send</b>
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
