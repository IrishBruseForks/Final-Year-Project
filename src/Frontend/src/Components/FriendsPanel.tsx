import AddIcon from "@mui/icons-material/Add";
import { Box, Divider, IconButton, List, Typography } from "@mui/material";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import API from "../Utility/Api";
import ChatItem from "./ChatItem";

// FriendsPanel componentz
// API/Database caller
function FriendsPanel() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery("getChannels", API.GetChannels);

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
              <AddIcon />
            </IconButton>
          </Box>
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
