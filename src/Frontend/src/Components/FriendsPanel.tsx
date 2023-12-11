import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Divider, IconButton, InputAdornment, List, Stack, TextField, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { ChannelResponse } from "../Types/ServerTypes";
import API from "../Utility/Api";
import { AddFriendModal } from "./AddFriendModal";
import ChannelItem from "./ChannelItem";
import { CreateChannelModal } from "./CreateChannelModal";

const FriendsPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch all channels
  const { data, isLoading } = useQuery<ChannelResponse[]>("getChannels", () => API.GetChannels());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchData = useMemo<ChannelResponse[] | undefined>(() => data && filterChannels(data), [searchTerm, data]);

  const [isChannelModalOpen, setIsChannelModalOpen] = useState<boolean>(false);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState<boolean>(false);

  function filterChannels(value: ChannelResponse[]): ChannelResponse[] {
    return value?.filter((channel) => channel.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
        <Stack direction={"row"}>
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
          <Stack direction={"row"} sx={{ height: "min-content", pt: 1, pl: 1 }}>
            <IconButton
              onClick={() => {
                setIsAddFriendModalOpen(true);
              }}
            >
              <PersonAddIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setIsChannelModalOpen(true);
              }}
            >
              <AddIcon />
            </IconButton>
          </Stack>
        </Stack>
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
