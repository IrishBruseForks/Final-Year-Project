import SendIcon from "@mui/icons-material/Send";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
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
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import from react-query for server state management
import axios from "axios"; // Import axios for making HTTP requests
import { enqueueSnackbar } from "notistack"; // Import enqueueSnackbar for showing snackbars (notifications)
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams hook for getting URL parameters
import { useAuth } from "../../Auth/useAuth"; // Custom hook for authentication
import { ChannelResponse, PostMessageBody, PostMessageResponse } from "../../Types/ServerTypes"; // Import type definitions
import Api from "../../Utility/Api";
import Urls from "../../Utility/Urls"; // Utility for managing URLs
import { getApiAuthConfig, useApi, useRefetchApi } from "../../Utility/useApi"; // API config and custom hook for API calls
import ImageUpload from "../ImageUpload";
import LazyImage from "../LazyImage"; // Component for lazy-loading images
import Message from "./Message"; // Import the Message component for displaying individual messages

// Define the MessageView component
function MessageView() {
  const queryClient = useQueryClient(); // Access the QueryClient to manage queries and cache
  const navigate = useNavigate();
  const { user } = useAuth(); // Use the custom useAuth hook to access the user's authentication status
  const { uuid } = useParams<{ uuid: string }>(); // Get the 'uuid' from the URL parameters

  const getMessageKey = ["getMessages", uuid]; // Define a key for caching messages

  // Fetch messages using a custom hook and refetch them every 5000ms
  const { data: messages } = useRefetchApi<PostMessageResponse[]>(getMessageKey, Urls.Messages + "?id=" + uuid, { retry: false, refetchInterval: 2_000 });
  const { data: smartReplies } = useApi<string[]>(["getReplies", uuid], Urls.Replies + "?id=" + uuid, { refetchInterval: false });

  useEffect(() => {
    const id = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["getReplies", uuid] });
    }, 30_000);

    return () => clearTimeout(id);
  }, [messages]);

  // Fetch channel data using a custom hook
  const { data: channel, error } = useRefetchApi<ChannelResponse>(["getChannel", uuid], Urls.Channel + "?id=" + uuid, { retry: false, refetchInterval: 5_000 });

  const { mutate } = useMutation({
    mutationFn: async (newMessage: PostMessageBody) => {
      // Function to call the API and send the new message
      await axios.post(import.meta.env.VITE_API_URL + Urls.Messages, newMessage, getApiAuthConfig(user!));
    },
    // Callback function after mutation is settled to refresh messages
    onSuccess: async () => {
      setMessageText("");
      setImage(undefined);
      return await queryClient.invalidateQueries({ queryKey: getMessageKey });
    },
    onError: async () => {
      enqueueSnackbar("Failed to send Message", { variant: "error" });
    },
  });

  const anchorRef = useRef<HTMLButtonElement>(null);
  const [opened, setOpened] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>(); // State for the file upload
  const [messageText, setMessageText] = useState(""); // State for the message input text

  useEffect(() => {
    if (error?.response?.status == 403) {
      navigate("/");
    }
  }, [error]);

  const users = useMemo(() => {
    if (!channel) return [];

    for (const user of channel.users) {
      queryClient.setQueryData(["user", user.id], user);
    }

    return channel.users;
  }, [channel]);

  // Get all users except the current user and system user for display
  const filteredUsers = useMemo(() => {
    return channel?.users?.filter((u) => !(u.id == "0" || (channel.users.length > 2 && u.id == user?.id)));
  }, [channel?.users]);

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

  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    setDeleteDialog(null);
    if (deleteDialog) {
      deleteMessageMutation.mutate(deleteDialog);
    } else {
      enqueueSnackbar("Failed to delete Message", { variant: "error" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(null);
  };

  // Detele mutation using React Query
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => Api.Delete("messages?id=" + messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getMessageKey }); // Refresh the messages after a successful delete
    },
  });

  // Render the component UI
  return (
    <Stack flexBasis={0} flexGrow={1} p={1.5} sx={{ m: { xs: 1, md: 2 } }} borderRadius={1} bgcolor="background.paper">
      <Box sx={{ display: "flex", alignItems: "center", height: 50, mb: 1 }}>
        <Typography sx={{ textAlign: "justify" }} variant="h5">
          {filteredUsers && (
            <Button ref={anchorRef} onClick={() => setOpened(!opened)} sx={{ mr: 1 }}>
              {/* Lazy load the channel picture */}
              <AvatarGroup max={3}>
                {filteredUsers.map((u) => {
                  return <Avatar key={u.id} alt={u.username} src={u.picture} sx={{ bgcolor: "background.paper" }} />;
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
            {filteredUsers?.map((u) => {
              return (
                <ListItem key={u.id}>
                  <ListItemAvatar>
                    <Avatar key={u.id} alt={u.username} src={u.picture} />
                  </ListItemAvatar>
                  <Typography>{u.username}</Typography>
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
          <Message key={message.id} message={message} id={message.sentBy} onDelete={(messageId) => setDeleteDialog(messageId)} />
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
        </Box>
      )}
      {/* Smart Replies Section */}
      {/* Use MobileSwitch to choose between mobile and desktop layouts */}
      <Stack sx={{ flexDirection: { md: "row", xs: "column" }, justifyContent: "center" }}>
        {/* Container to control sizing */}
        {smartReplies &&
          smartReplies.map((reply, index) => (
            <Tooltip key={index} title={reply}>
              <Chip
                label={reply}
                onClick={() => handleSmartReply(reply)}
                variant="outlined"
                sx={{
                  maxWidth: { md: "300px", xs: "80vw" },
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
      <Dialog fullScreen={false} open={deleteDialog !== null} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" autoFocus onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button color="error" autoFocus onClick={handleDeleteConfirm}>
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default MessageView;
