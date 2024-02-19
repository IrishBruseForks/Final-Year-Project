import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Divider, IconButton, InputAdornment, LinearProgress, List, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChannelsResponse } from "../Types/ServerTypes";
import Urls from "../Utility/Urls";
import { useRefetchApi } from "../Utility/useApi";
import { AddFriendModal } from "./AddFriendModal";
import ChannelItem from "./ChannelItem";
import { CreateChannelModal } from "./CreateChannelModal";

const FriendsPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const navigate = useNavigate();

  // Fetch all channels
  const { data, isLoading, isError } = useRefetchApi<ChannelsResponse[]>("getChannels", Urls.Channels, "Fetching channels", { refetchInterval: 2000 });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchData = useMemo<ChannelsResponse[] | undefined>(() => data && filterChannels(data), [searchTerm, data]);

  const [isChannelModalOpen, setIsChannelModalOpen] = useState<boolean>(false);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState<boolean>(false);

  function filterChannels(value: ChannelsResponse[]): ChannelsResponse[] {
    return value?.filter((channel) => channel.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  const { uuid } = useParams<{ uuid: string }>();

  useEffect(() => {
    if (!uuid && data && data[0]) {
      navigate(data[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Stack
      sx={{
        p: 1,
        bgcolor: "background.paper", // Use a theme color or specific hex color
        minHeight: "0vh", // Adjust based on your layout needs
        // Other styling as needed
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "left",
          backgroundColor: "transparent",
        }}
      >
        <Box sx={{ borderBottom: 1, display: "flex", alignItems: "center" }}>
          <Typography variant="h5">Channels</Typography>
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
      <List
        sx={{
          flex: "1 1 auto",
          overflowY: "auto",
          width: "100%",
          height: { md: "0px" }, // CSS makes no sense
        }}
      >
        {isError && <LinearProgress />}

        {!isLoading && searchData && searchData.length > 0 ? (
          searchData.map((channel: ChannelsResponse) => (
            <ChannelItem id={channel.id} username={channel.name} lastMessage={channel.lastMessage} profilePic={channel.picture} key={channel.id} />
          ))
        ) : (
          <Typography textAlign={"center"} py={4}>
            No channels found
          </Typography>
        )}
      </List>
      <CreateChannelModal open={isChannelModalOpen} handleClose={() => setIsChannelModalOpen(false)} defaultChannelName={""} />
      <AddFriendModal open={isAddFriendModalOpen} handleClose={() => setIsAddFriendModalOpen(false)} />
    </Stack>
  );
};

export default FriendsPanel;
