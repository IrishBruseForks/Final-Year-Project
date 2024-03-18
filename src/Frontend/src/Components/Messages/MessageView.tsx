import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  Menu,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios"; // Import axios for making HTTP requests
import { enqueueSnackbar } from "notistack"; // Import enqueueSnackbar for showing snackbars (notifications)
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query"; // Import from react-query for server state management
import { useNavigate, useParams } from "react-router-dom"; // Import useParams hook for getting URL parameters
import { useAuth } from "../../Auth/useAuth"; // Custom hook for authentication
import { ChannelResponse, PostMessageBody, PostMessageResponse } from "../../Types/ServerTypes"; // Import type definitions
import Urls from "../../Utility/Urls"; // Utility for managing URLs
import { getApiAuthConfig, useApi, useRefetchApi } from "../../Utility/useApi"; // API config and custom hook for API calls
import ImageUpload from "../ImageUpload";
import LazyImage from "../LazyImage"; // Component for lazy-loading images
import Message from "./Message"; // Import the Message component for displaying individual messages

// Define the MessageView component
function MessageView() {
  const { uuid } = useParams<{ uuid: string }>(); // Get the 'uuid' from the URL parameters
  const getMessageKey = ["getMessages", uuid]; // Define a key for caching messages
  // Fetch messages using a custom hook and refetch them every 5000ms
  const { data: messages } = useRefetchApi<PostMessageResponse[]>(getMessageKey, Urls.Messages + "?id=" + uuid, {
    refetchInterval: 2_000,
  });

  const queryClient = useQueryClient(); // Access the QueryClient to manage queries and cache
  const { data: smartReplies } = useApi<string[]>(["getReplies", uuid], Urls.Replies, { refetchInterval: false });

  useEffect(() => {
    const id = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["getReplies", uuid] });
    }, 30_000);

    return () => clearTimeout(id);
  }, [messages]);

  const replies = useMemo(() => {
    if (smartReplies) {
      return smartReplies;
    }
    return [];
  }, [smartReplies]);

  const navigate = useNavigate();

  const { user } = useAuth(); // Use the custom useAuth hook to access the user's authentication status

  // Fetch channel data using a custom hook
  const { data: channel, error } = useRefetchApi<ChannelResponse>(["getChannel", uuid], Urls.Channel + "?id=" + uuid, { retry: false });

  const { mutate } = useMutation({
    mutationFn: async (newMessage: PostMessageBody) => {
      // Function to call the API and send the new message
      await axios.post(import.meta.env.VITE_API_URL + Urls.Messages, newMessage, getApiAuthConfig(user!));
    },
    // Callback function after mutation is settled to refresh messages
    onSettled: async () => {
      setMessageText("");
      setImage(undefined);
      return await queryClient.invalidateQueries({ queryKey: getMessageKey });
    },
  });

  const anchorRef = useRef<HTMLButtonElement>(null);
  const [opened, setOpened] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>(); // State for the file upload

  const [messageText, setMessageText] = useState(""); // State for the message input text for smart replies

  useEffect(() => {
    if (error?.response?.status == 403) {
      navigate("/");
    }
  }, [error]);

  // Function to handle sending a message
  const sendMessage = async () => {
    try {
      // Create a message object and send it
      if (!uuid || !user || (!image && messageText == "")) return; // Check for empty message, missing uuid, or user

      const newMessage: PostMessageBody = { content: messageText, channelId: uuid, image: image };

      mutate(newMessage);
    } catch (error) {
      console.log("Error sending Message:", error);
      enqueueSnackbar(error as any); // Show an error notification
    }
  };

  // Function to set the message text to a smart reply when clicked
  const handleSmartReply = (reply: string) => {
    setMessageText(reply);
  };
  // Detele mutation using React Query
  const deleteMessageMutation = useMutation(
    (messageId: string) => axios.delete(`${import.meta.env.VITE_API_URL}/messages/${messageId}`, getApiAuthConfig(user!)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(getMessageKey); // Refresh the messages after a successful delete
      },
    }
  );
  // Render the component UI
  return (
    <Stack flexBasis={0} flexGrow={1} p={1.5} sx={{ m: { xs: 1, md: 2 } }} borderRadius={1} bgcolor="background.paper">
      <Box sx={{ display: "flex", alignItems: "center", height: 50, mb: 1 }}>
        <Typography sx={{ textAlign: "justify" }} variant="h5">
          {channel?.users && (
            <Button ref={anchorRef} onClick={() => setOpened(!opened)} sx={{ mr: 1 }}>
              {/* Lazy load the channel picture */}
              <AvatarGroup contextMenu="" max={3}>
                {channel?.users?.map((user) => {
                  return <Avatar key={user.id} alt={user.username} src={user.picture} sx={{ bgcolor: "background.paper" }} />;
                })}
              </AvatarGroup>
            </Button>
          )}
          {channel?.name} {/* Display the channel name */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorRef.current}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            open={opened}
            onClose={() => {
              setOpened(false);
            }}
          >
            <ListItem>
              <Typography>Users</Typography>
            </ListItem>
            <Divider />
            {channel?.users?.map((user) => {
              return (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar key={user.id} alt={user.username} src={user.picture} />
                  </ListItemAvatar>
                  <Typography>{user.username}</Typography>
                </ListItem>
              );
            })}
          </Menu>
        </Typography>
      </Box>
      <Divider />

      {/* Messages List */}
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
        {/* Map over the fetched messages and display them */}
        {messages?.map((message) => (
          <Message key={message.id} message={message} channel={channel} onDelete={(messageId) => deleteMessageMutation.mutate(messageId)} />
        ))}
      </List>
      {image && (
        <Box sx={{ mb: 2, position: "relative", maxWidth: "100px" }}>
          <LazyImage
            src={"data:image/png;base64, " + image}
            sx={{
              width: 100,
              borderRadius: 1,
              borderColor: "#616161",
              borderWidth: 1,
              borderStyle: "solid",
              overflow: "hidden",
            }}
          />
          <IconButton color="error" onClick={() => setImage(undefined)} sx={{ backgroundColor: "#00000022", position: "absolute", top: -15, right: -15 }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
      {/* Smart Replies Section */}
      {/* Use MobileSwitch to choose between mobile and desktop layouts */}
      <Stack sx={{ flexDirection: { md: "row", xs: "column" }, justifyContent: "center" }}>
        {/* Container to control sizing */}
        {replies.map((reply) => (
          <Tooltip title={reply}>
            <Chip
              label={reply}
              onClick={() => handleSmartReply(reply)}
              variant="outlined"
              sx={{
                maxWidth: "100%",
                mx: 2,
                my: { xs: 1 },
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            />
          </Tooltip>
        ))}
      </Stack>
      {/* Message Input Section */}
      <Stack direction={"row"} display={"flex"} alignItems={"center"} justifyContent={"center"} gap={1}>
        {/* Upload Button */}
        <Button component="label" sx={{ minWidth: "10px", p: 1.5 }} disabled={channel === undefined}>
          <UploadIcon />
          <ImageUpload
            onChange={(img) => {
              setImage(img);
            }}
          />
        </Button>
        {/* Text Field for typing the message */}
        <TextField
          disabled={channel === undefined}
          size="medium"
          autoFocus
          margin="dense"
          label="Message"
          autoComplete="on"
          multiline={true}
          maxRows={4}
          fullWidth
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)} // Update the message text state on change
          onKeyDown={(e) => {
            // Send the message when Enter is pressed (without Shift)
            if (!e.shiftKey && e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button variant="contained" endIcon={<SendIcon />} onClick={sendMessage} disabled={channel === undefined}>
                  <b>Send</b> {/* Send Button */}
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
