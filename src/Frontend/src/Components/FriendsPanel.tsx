import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import ChatItem from "./ChatItem";
import { ChannelResponse } from "../Types/ServerTypes";
import API from "../Utility/Api";

// FriendsPanel component
// API/Database caller
function FriendsPanel() {
  // State for channels and its setter
  const [channels, setChannels] = useState<ChannelResponse[]>([]);

  // State for loading status and its setter
  const [loading, setLoading] = useState(true);

  // Hook that runs once component mounts
  useEffect(() => {
    // Async function to fetch channels
    async function fetchChannels() {
      try {
        const response = await API.GetChannels();
        setChannels(response); // Update channels state
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error("Error fetching channels:", error);
        setLoading(false); // Set loading to false on error
      }
    }

    fetchChannels(); // Invoke the fetch function
  }, []);

  return (
    <Box>
      {/* Conditional rendering - if loading, show the loading text */}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Box
            sx={{
              p: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <Typography variant="h6">Chats</Typography>
            <IconButton>
              <AddIcon />
            </IconButton>
          </Box>
          <Divider />
          <Stack direction={"column"} spacing={1}>
            {channels.map((channel) => (
              <ChatItem username={channel.username} lastMessage={channel.lastMessage} profilePic={channel.profilePic} key={channel.username} />
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
}

export default FriendsPanel;
