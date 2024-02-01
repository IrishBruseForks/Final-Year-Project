import GroupsIcon from "@mui/icons-material/Groups";
import SendIcon from "@mui/icons-material/Send";
import UploadIcon from "@mui/icons-material/Upload";
import { Box, Button, IconButton, InputAdornment, List, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth";
import { ChannelResponse, PostMessageBody, PostMessageResponse } from "../../Types/ServerTypes";
import Urls from "../../Utility/Urls";
import { getApiConfig, useRefetchApi } from "../../Utility/useApi";
import LazyImage from "../LazyImage";
import Message from "./Message";

function MessageView() {
  const { uuid } = useParams<{ uuid: string }>();
  const getMessageKey = ["getMessages", uuid];
  const { data: messages } = useRefetchApi<PostMessageResponse[]>(getMessageKey, Urls.Messages + "?id=" + uuid, "Fetching messages", {
    refetchInterval: 5000,
  });
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: channel } = useRefetchApi<ChannelResponse>(["getChannel", uuid], Urls.Channel + "?id=" + uuid, "Fetching channels");

  // Implement optimistic
  const { isLoading, mutate, variables } = useMutation({
    mutationFn: async (newMessage: PostMessageBody) => {
      await axios.post(import.meta.env.VITE_API_URL + Urls.Messages, newMessage, getApiConfig(user!));
    },

    // onMutate: async (newTodo) => {
    //   // Cancel any outgoing refetches
    //   // (so they don't overwrite our optimistic update)
    //   await queryClient.cancelQueries({ queryKey: getMessageKey });

    //   // Snapshot the previous value
    //   const previousTodos = queryClient.getQueryData(getMessageKey);

    //   // Optimistically update to the new value
    //   queryClient.setQueryData(getMessageKey, (old: any) => [...old, newTodo]);

    //   // Return a context object with the snapshotted value
    //   return { previousTodos };
    // },

    // make sure to _return_ the Promise from the query invalidation
    // so that the mutation stays in `pending` state until the refetch is finished
    onSettled: async () => {
      console.log("Settled");
      return await queryClient.invalidateQueries({ queryKey: getMessageKey });
    },
  });

  const handleSendMessage = async () => {
    if (messageText === "") return;
    if (!uuid) return;
    if (!user) return;

    try {
      const newMessage: PostMessageBody = { content: messageText, channelId: uuid };
      await mutate(newMessage);
      setMessageText("");
    } catch (error) {
      console.log("Error sending Message:", error);
      enqueueSnackbar(error as any);
    }
  };

  const [messageText, setMessageText] = useState("");

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
          flexBasis: 1,
          flexGrow: 1,
          display: "flex",
          overflowY: "auto",
          flexDirection: "column-reverse",
        }}
      >
        {isLoading && variables && (
          // This is where the message is being optimistically updated
          <Message
            key={"pending"}
            message={{ content: variables.content, sentOn: new Date(Date.now()).toString(), channelId: uuid ?? "", sentBy: "user.id" }}
            channel={channel}
          ></Message>
        )}
        {messages?.map((message) => (
          <Message key={message.sentOn} message={message} channel={channel}></Message>
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
