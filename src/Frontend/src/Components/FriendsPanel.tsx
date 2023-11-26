import AddIcon from "@mui/icons-material/Add";
import { Box, Divider, IconButton, List, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import API from "../Utility/Api";
import ChannelItem from "./ChannelItem";
import { CreateChannelModal } from "./CreateChannelModal"; // Import the modal component

function FriendsPanel() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery("getChannels", API.GetChannels);
  const [open, setOpen] = useState(false);

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
      <CreateChannelModal open={open} handleClose={handleClose} />
    </Box>
  );
}

export default FriendsPanel;
