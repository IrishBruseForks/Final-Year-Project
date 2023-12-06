import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Divider, IconButton, TextField, Typography, List, InputAdornment } from "@mui/material";
import { useQuery } from "react-query";
import API from "../Utility/Api";
import ChannelItem from "./ChannelItem";
import { CreateChannelModal } from "./CreateChannelModal";
import { AddFriendModal } from "./AddFriendModal";

// Assuming ChannelResponse is defined elsewhere in your code
interface ChannelResponse {
  id: string;
  name: string;
  picture: string;
  lastMessage?: number | string;
}

const FriendsPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredChannels, setFilteredChannels] = useState<ChannelResponse[]>([]);

  // Fetch all channels initially
  const { data: channels, isLoading } = useQuery(["getChannels"], () => API.GetChannels());

  // Effect to filter channels based on searchTerm
  useEffect(() => {
    if (channels) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filtered = channels.filter(
        (channel) => channel.name.toLowerCase().includes(lowerCaseSearchTerm) || channel.id.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredChannels(filtered);
    }
  }, [channels, searchTerm]);

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
          maxHeight: "100%",
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
          onChange={(e) => setSearchTerm(e.target.value)}
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
      <List sx={{ maxHeight: "100%", overflow: "auto" }}>
        {!isLoading && filteredChannels.length > 0 ? (
          filteredChannels.map((channel) => (
            <ChannelItem
              id={channel.id}
              username={channel.name} // Assuming username is part of channel response
              lastMessage={channel.lastMessage ? "" + channel.lastMessage : "No message"}
              profilePic={channel.picture}
              key={channel.id}
            />
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
