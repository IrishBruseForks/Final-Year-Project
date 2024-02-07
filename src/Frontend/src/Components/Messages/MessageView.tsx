import React, { useState } from 'react';
import { Box, Button, IconButton, InputAdornment, List, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import UploadIcon from '@mui/icons-material/Upload';
import GroupsIcon from '@mui/icons-material/Groups'; // Import the icon for group chat
import axios from 'axios'; // Import axios for making HTTP requests
import { enqueueSnackbar } from 'notistack'; // Import enqueueSnackbar for showing snackbars (notifications)
import { useMutation, useQueryClient } from 'react-query'; // Import from react-query for server state management
import { useParams } from 'react-router-dom'; // Import useParams hook for getting URL parameters
import { useAuth } from '../../Auth/useAuth'; // Custom hook for authentication
import { ChannelResponse, PostMessageBody, PostMessageResponse } from '../../Types/ServerTypes'; // Import type definitions
import Urls from '../../Utility/Urls'; // Utility for managing URLs
import { getApiConfig, useRefetchApi } from '../../Utility/useApi'; // API config and custom hook for API calls
import LazyImage from '../LazyImage'; // Component for lazy-loading images
import Message from './Message'; // Import the Message component for displaying individual messages

// Define the MobileSwitch component for responsive layout
function MobileSwitch({ mobile, desktop }: { mobile: JSX.Element; desktop: JSX.Element }) {
  const isMobile = !useMediaQuery("(min-width:900px)");
  return isMobile ? mobile : desktop;
}

// Define the MessageView component
function MessageView() {
  const { uuid } = useParams<{ uuid: string }>(); // Get the 'uuid' from the URL parameters
  const getMessageKey = ['getMessages', uuid]; // Define a key for caching messages
  // Fetch messages using a custom hook and refetch them every 5000ms
  const { data: messages } = useRefetchApi<PostMessageResponse[]>(getMessageKey, Urls.Messages + '?id=' + uuid, 'Fetching messages', {
    refetchInterval: 5000,
  });
  const queryClient = useQueryClient(); // Access the QueryClient to manage queries and cache
  const { user } = useAuth(); // Use the custom useAuth hook to access the user's authentication status

  // Fetch channel data using a custom hook
  const { data: channel } = useRefetchApi<ChannelResponse>(['getChannel', uuid], Urls.Channel + '?id=' + uuid, 'Fetching channels');

  const { isLoading, mutate } = useMutation({
    mutationFn: async (newMessage: PostMessageBody) => {
      // Function to call the API and send the new message
      await axios.post(import.meta.env.VITE_API_URL + Urls.Messages, newMessage, getApiConfig(user!));
    },
    // Callback function after mutation is settled to refresh messages
    onSettled: async () => {
      console.log('Settled');
      return await queryClient.invalidateQueries({ queryKey: getMessageKey });
    },
  });

  const [messageText, setMessageText] = useState(''); // State for the message input text for smart replies
  const [smartReplies] = useState(['Reply 1', 'Reply 2', 'Reply 3']); // Static smart replies for demonstration

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (messageText === '' || !uuid || !user) return; // Check for empty message, missing uuid, or user

    try {
      // Create a message object and send it
      const newMessage: PostMessageBody = { content: messageText, channelId: uuid };
      await mutate(newMessage);
      setMessageText(''); // Clear the input after sending
    } catch (error) {
      console.log('Error sending Message:', error);
      enqueueSnackbar(error as any); // Show an error notification
    }
  };

  // Function to set the message text to a smart reply when clicked
  const handleSmartReply = (reply: string) => {
    setMessageText(reply);
  };

  // Define mobile layout for smart replies
  const mobileLayout = (
    <Stack direction="column" spacing={1}>
      {smartReplies.map((reply, index) => (
        <Button key={index} variant="outlined" onClick={() => handleSmartReply(reply)} fullWidth>
          {reply}
        </Button>
      ))}
    </Stack>
  );

  // Define desktop layout for smart replies
  const desktopLayout = (
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-around' }}>
      {smartReplies.map((reply, index) => (
        <Button key={index} variant="outlined" onClick={() => handleSmartReply(reply)}>
          {reply}
        </Button>
      ))}
    </Box>
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
        {/* Show a loading message if messages are being fetched */}
        {isLoading && (
          <Typography>Loading messages...</Typography>
        )}
        {/* Map over the fetched messages and display them */}
        {messages?.map((message) => (
          <Message key={message.sentOn} message={message} channel={channel}></Message>
        ))}
      </List>
      {/* Smart Replies Section */}
      {/* Use MobileSwitch to choose between mobile and desktop layouts */}
      <MobileSwitch mobile={mobileLayout} desktop={desktopLayout} />
      {/* Message Input Section */}
      <Stack direction={"row"} display={"flex"} alignItems={"center"} justifyContent={"center"} gap={1}>
        {/* Upload Button (no functionality shown in this snippet) */}
        <Box>
          <IconButton onClick={() => {}}>
            <UploadIcon />
          </IconButton>
        </Box>
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
              handleSendMessage();
            }
          }}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendMessage}>
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