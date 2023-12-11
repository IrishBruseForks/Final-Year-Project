import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Divider, IconButton, InputAdornment, List, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useQuery } from "react-query";
import API from "../Utility/Api";
import { AddFriendModal } from "./AddFriendModal";
import ChannelItem from "./ChannelItem";
import { CreateChannelModal } from "./CreateChannelModal";
import { ChannelResponse } from "../Types/ServerTypes";

const FriendsPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch all channels
  const { data, isLoading } = useQuery<ChannelResponse[]>("getChannels", () => API.GetChannels());

  const [searchData, setSearchData] = useState<ChannelResponse[] | undefined>(data);

  const [isChannelModalOpen, setIsChannelModalOpen] = useState<boolean>(false);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState<boolean>(false);

  function searchChannels(value: string): void {
    setSearchTerm(value);
    console.log(data);

    if (value === "") {
      setSearchData(data);
    }else{

    const filtered = data?.filter((channel) => channel.name.toLowerCase().includes(value.toLowerCase()));

    setSearchData(filtered);
}
    
  }

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
        <IconButton
          sx={{ marginTop: 2, justifyContent: "flex-start" }}
          onClick={() => {
            setIsChannelModalOpen(true);
          }}
        >
          <AddIcon />
          <Typography sx={{ marginLeft: 0.5 }} variant="caption">
            Create Channel
          </Typography>
        </IconButton>
        <IconButton
          sx={{ marginBottom: 0.5, justifyContent: "flex-start" }}
          onClick={() => {
            setIsAddFriendModalOpen(true);
          }}
        >
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
          onChange={(e) => searchChannels(e.target.value)} // Update the search term when input changes
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
        {!isLoading && searchData && searchData.length > 0 ? (
          searchData.map((channel: ChannelResponse) => (
            <ChannelItem id={channel.id} username={channel.name} lastMessage={"" + channel.lastMessage} profilePic={channel.picture} key={channel.id} />
          ))
        ) : (
          <Typography>No channels found</Typography>
        )}
      </List>
      <CreateChannelModal open={isChannelModalOpen} handleClose={() => setIsChannelModalOpen(false)} defaultChannelName={""} />
      <AddFriendModal open={isAddFriendModalOpen} handleClose={() => setIsAddFriendModalOpen(false)} />
    </Box>
  );
};

export default FriendsPanel;
