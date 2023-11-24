import React, { useState, useEffect } from "react";
import { Box, Divider, IconButton, List, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery, useQueryClient } from "react-query";
import API from "../Utility/Api";
import ChannelItem from "./ChannelItem";
import { CreateChannelModal } from "./CreateChannelModal"; // Import the modal component

function FriendsPanel() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery("getChannels", API.GetChannels);
  const [open, setOpen] = useState(false);

  // Assuming you have a method to get the current user's name
  // This is a placeholder, replace it with the actual logic
  const currentUserName = "Ryan Harte"; // Replace with dynamic user's name retrieval

  useEffect(() => {
    // This interval will refetch channels every 5 seconds
    const interval = setInterval(() => {
      queryClient.invalidateQueries("getChannels");
    }, 5000);
    return () => clearInterval(interval);
  }, [queryClient]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      {isLoading ? (
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
            <IconButton onClick={handleOpen}>
              <AddIcon />
            </IconButton>
          </Box>
          <Divider />
          <List sx={{ maxHeight: "100%", overflow: "auto" }}>
            {data?.map((channel) => (
              <ChannelItem username={channel.name} lastMessage={"" + channel.lastMessage} profilePic={channel.picture} key={channel.id} />
            ))}
          </List>
        </>
      )}
      <CreateChannelModal
        open={open}
        handleClose={handleClose}
        defaultChannelName={currentUserName} 
      />
    </Box>
  );
}

export default FriendsPanel;
