import GroupsIcon from "@mui/icons-material/Groups"; // Import the icon for group chat
import SendIcon from "@mui/icons-material/Send";
import UploadIcon from "@mui/icons-material/Upload";
import { Box, Button, Chip, Grid, IconButton, InputAdornment, List, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import axios from "axios"; // Import axios for making HTTP requests
import { enqueueSnackbar } from "notistack"; // Import enqueueSnackbar for showing snackbars (notifications)
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query"; // Import from react-query for server state management
import { useParams } from "react-router-dom"; // Import useParams hook for getting URL parameters
import { useAuth } from "../../Auth/useAuth"; // Custom hook for authentication
import { ChannelResponse, PostMessageBody, PostMessageResponse } from "../../Types/ServerTypes"; // Import type definitions
import Urls from "../../Utility/Urls"; // Utility for managing URLs
import { getApiConfig, useRefetchApi } from "../../Utility/useApi"; // API config and custom hook for API calls
import LazyImage from "../LazyImage"; // Component for lazy-loading images
import Message from "./Message"; // Import the Message component for displaying individual messages

// Define the MobileSwitch component for responsive layout
function MobileSwitch({ mobile, desktop }: { mobile: JSX.Element; desktop: JSX.Element }) {
  const isMobile = !useMediaQuery("(min-width:900px)");
  return isMobile ? mobile : desktop;
}

// Define the MessageView component
function MessageView() {
  const { uuid } = useParams<{ uuid: string }>(); // Get the 'uuid' from the URL parameters
  const getMessageKey = ["getMessages", uuid]; // Define a key for caching messages
  // Fetch messages using a custom hook and refetch them every 5000ms
  const { data: messages } = useRefetchApi<PostMessageResponse[]>(getMessageKey, Urls.Messages + "?id=" + uuid, "Fetching messages", { refetchInterval: 2000 });
  const queryClient = useQueryClient(); // Access the QueryClient to manage queries and cache
  const { user } = useAuth(); // Use the custom useAuth hook to access the user's authentication status

  const [file, setFile] = useState<File | undefined>(); // State for the file upload

  // Fetch channel data using a custom hook
  const { data: channel } = useRefetchApi<ChannelResponse>(["getChannel", uuid], Urls.Channel + "?id=" + uuid, "Fetching channels");

  const { mutate } = useMutation({
    mutationFn: async (newMessage: PostMessageBody) => {
      // Function to call the API and send the new message
      await axios.post(import.meta.env.VITE_API_URL + Urls.Messages, newMessage, getApiConfig(user!));
    },
    // Callback function after mutation is settled to refresh messages
    onSettled: async () => {
      setMessageText("");
      return await queryClient.invalidateQueries({ queryKey: getMessageKey });
    },
  });

  const [messageText, setMessageText] = useState(""); // State for the message input text for smart replies

  // Static smart replies for demonstration
  const [smartReplies] = useState([
    "Lorem ipsum dolor sit amet Sed do eiusmod tempor incididunt ut labore Sed do eiusmod tempor incididunt ut labore",
    "Consectetur adipiscing elit",
    "Sed do eiusmod tempor incididunt ut labore",
  ]); // Static smart replies for demonstration

  const toBase64 = (file: File): Promise<string | undefined> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString());
      reader.onerror = reject;
    });

  // Function to handle sending a message
  const sendMessage = async () => {
    try {
      // Create a message object and send it
      if (messageText === "" || !uuid || !user) return; // Check for empty message, missing uuid, or user

      let fileBase64: string | undefined;
      if (file) {
        fileBase64 = (await toBase64(file))?.split(",")[1];
      }

      const newMessage: PostMessageBody = { content: messageText, channelId: uuid, image: fileBase64 };
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

  // Modified mobileLayout with Chips wrapped in a Box for individual sizing
  const mobileLayout = (
    <Stack direction="column" spacing={1}>
      {smartReplies.map((reply, index) => (
        <Box key={index} sx={{ display: "flex", justifyContent: "center" }}>
          {/* Container to control sizing */}
          <Chip
            label={reply}
            onClick={() => handleSmartReply(reply)}
            variant="outlined"
            sx={{
              maxWidth: 300, // Set a specific maxWidth for each Chip
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          />
        </Box>
      ))}
    </Stack>
  );

  // Adjusted desktopLayout using Grid for equal sizing and spacing of Chips
  const desktopLayout = (
    <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
      {/* Adjust spacing as needed */}
      {smartReplies.map((reply, index) => (
        <Grid item xs={4} key={index}>
          {/* xs=4 for 3 items per row, adjust as necessary */}
          <Chip
            label={reply}
            onClick={() => handleSmartReply(reply)}
            variant="outlined"
            sx={{
              width: "100%", // Ensure the Chip fills its container
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          />
        </Grid>
      ))}
    </Grid>
  );

  // Render the component UI
  return (
    <Stack flexBasis={0} flexGrow={1} p={1.5} sx={{ m: { xs: 1, md: 2 } }} borderRadius={1} bgcolor="background.paper">
      {/* Channel Header */}
      <Box sx={{ borderBottom: 1, display: "flex", alignItems: "center" }}>
        <Typography sx={{ textAlign: "justify" }} variant="h5">
          <IconButton>
            {/* Lazy load the channel picture */}
            <LazyImage src={channel?.picture} title="Profile Picture" sx={{ height: 32, width: 32, borderRadius: "50%" }} placeholder={<GroupsIcon />} />
          </IconButton>
          {channel?.name} {/* Display the channel name */}
        </Typography>
      </Box>
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
          <Message key={message.sentOn} message={message} channel={channel} />
        ))}
      </List>
      {/* Smart Replies Section */}
      {/* Use MobileSwitch to choose between mobile and desktop layouts */}
      <MobileSwitch mobile={mobileLayout} desktop={desktopLayout} />
      {/* Message Input Section */}
      <Stack direction={"row"} display={"flex"} alignItems={"center"} justifyContent={"center"} gap={1}>
        {/* Upload Button */}
        <Button component="label" sx={{ width: "1px" }}>
          <UploadIcon />
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files?.item(0) ?? undefined);
              e.target.value = null as any;
            }}
          />
        </Button>
        {/* Text Field for typing the message */}
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
                <Button variant="contained" endIcon={<SendIcon />} onClick={sendMessage}>
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
