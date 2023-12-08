import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Divider, IconButton, TextField, Typography, List, InputAdornment } from "@mui/material";
import { useQuery, useQueryClient } from "react-query";
import API from "../Utility/Api";
import ChannelItem from "./ChannelItem";
import { CreateChannelModal } from "./CreateChannelModal";
import { AddFriendModal } from "./AddFriendModal";

// Assuming ChannelResponse is defined elsewhere in your code
interface ChannelResponse {
  id: string;
  name: string;
  picture: string;
  lastMessage?: number | string; // Update the type to handle undefined
}

const FriendsPanel: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data, isLoading } = useQuery(["getChannels", searchTerm], () => API.GetChannels(searchTerm)); // Update the query key

  const [openChannelModal, setOpenChannelModal] = useState<boolean>(false);
  const [openAddFriendModal, setOpenAddFriendModal] = useState<boolean>(false);

  const handleOpenChannelModal = () => setOpenChannelModal(true);
  const handleCloseChannelModal = () => setOpenChannelModal(false);
  const handleOpenAddFriendModal = () => setOpenAddFriendModal(true);
  const handleCloseAddFriendModal = () => setOpenAddFriendModal(false);

  return (
    <Box>
      <Box
        sx={{
          p: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "left",
          backgroundColor: "transparent",
        }}
      >
        <Box sx={{ borderBottom: 1, display: "flex", alignItems: "center" }}>
          <Typography variant="h5">Chata-Lists</Typography>
        </Box>
        <IconButton sx={{ marginTop: 2, justifyContent: "flex-start" }} onClick={handleOpenChannelModal}>
          <AddIcon />
          <Typography sx={{ marginLeft: 0.5 }} variant="caption">
            Create Channel
          </Typography>
        </IconButton>
        <IconButton sx={{ marginBottom: 0.5, justifyContent: "flex-start" }} onClick={handleOpenAddFriendModal}>
          <PersonAddIcon />
          <Typography sx={{ marginLeft: 0.5 }} variant="caption">
            Add Friend
          </Typography>
        </IconButton>
        <TextField
          size="small"
          autoFocus
          margin="dense"
          label="Find a Channel"
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update the search term when input changes
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Divider />
      <List sx={{ maxHeight: "calc(89vh - 160px)", overflowY: "auto" }}>
        {!isLoading && data ? (
          data.map((channel) => (
            <ChannelItem id={channel.id} username={channel.name} lastMessage={"" + channel.lastMessage} profilePic={channel.picture} key={channel.id} />
          ))
        ) : (
          <Typography>No channels found</Typography>
        )}
      </List>
      <CreateChannelModal open={openChannelModal} handleClose={handleCloseChannelModal} defaultChannelName={""} />
      <AddFriendModal open={openAddFriendModal} handleClose={handleCloseAddFriendModal} />
    </Box>
  );
};

export default FriendsPanel;
