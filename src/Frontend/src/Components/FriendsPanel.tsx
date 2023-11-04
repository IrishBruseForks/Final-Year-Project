import AddIcon from "@mui/icons-material/Add";
import { Box, Divider, IconButton, List, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ChannelResponse } from "../Types/ServerTypes";
import API from "../Utility/Api";
import ChatItem from "./ChatItem";

// FriendsPanel componentz
// API/Database caller
function FriendsPanel() {
  // State for channels and its setter
  const [channels, setChannels] = useState<ChannelResponse[]>([]);

  // State for loading status and its setter
  const [loading, setLoading] = useState(true);

  // Async function to fetch channels
  async function fetchChannels() {
    try {
      const response = await API.GetChannels();
      setChannels(response); // Update channels state
      setLoading(false); // Set loading to false
    } catch (error) {
      setLoading(false); // Set loading to false on error
    }
  }

  // Hook that runs once component mounts
  useEffect(() => {
    const timeout = setInterval(() => {
      fetchChannels(); // Invoke the fetch function
    }, 5000);

    return () => clearTimeout(timeout);
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
              maxHeight: "100%",
            }}
          >
            <Typography variant="h6">Chats</Typography>
            <IconButton>
              <AddIcon />
            </IconButton>
          </Box>
          <Divider />
          <List sx={{ maxHeight: "100%" }}>
            {channels &&
              channels.map((channel) => (
                <ChatItem username={channel.name} lastMessage={"" + channel.lastMessage} profilePic={channel.picture} key={channel.id} />
              ))}
          </List>
        </>
      )}
    </Box>
  );
}

export default FriendsPanel;
