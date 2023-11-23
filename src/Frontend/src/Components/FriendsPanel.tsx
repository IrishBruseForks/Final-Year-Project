import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box, Divider, IconButton, List, Typography } from "@mui/material";
import * as React from "react";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import API from "../Utility/Api";
import ChatItem from "./ChatItem";
import NewChatModal from "./NewChatModal.1";

// FriendsPanel componentz
// API/Database caller
function FriendsPanel() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery("getChannels", API.GetChannels);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Hook that runs once component mounts
  useEffect(() => {
    const timeout = setInterval(() => {
      queryClient.invalidateQueries("getChannels"); // Invoke the fetch function
    }, 5000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      {/* Conditional rendering - if loading, show the loading text */}
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
            <IconButton>
              <PersonAddIcon />
            </IconButton>
            <IconButton onClick={handleOpen}>
              <AddIcon />
            </IconButton>
          </Box>
          <NewChatModal open={open} handleClose={handleClose} />
          <Divider />
          <List sx={{ maxHeight: "100%" }}>
            {data?.map((channel) => (
              <ChatItem username={channel.name} lastMessage={"" + channel.lastMessage} profilePic={channel.picture} key={channel.id} />
            ))}
          </List>
        </>
      )}
    </Box>
  );
}

export default FriendsPanel;
