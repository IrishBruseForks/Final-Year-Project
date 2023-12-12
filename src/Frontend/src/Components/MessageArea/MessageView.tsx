import React, { useState } from "react";
import { Grid, Box, Paper, Stack, TextField, Button, InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageList from "./MessageList";
import Urls from "../../Utility/Urls";
import axios from "axios";
import Constants from "../../Utility/Constants";

function MessageView() {
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = async () => {
    if (!messageText) return;

    // Replace with actual logic to send a message
    await axios.post(Constants.BackendUrl + Urls.Messages, { content: messageText });

    setMessageText("");
    // Optionally, you can refetch or update the messages list to show the new message
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
            <MessageList />
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
