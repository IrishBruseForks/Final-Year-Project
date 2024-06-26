import AddIcon from "@mui/icons-material/Add";
import ContactsIcon from "@mui/icons-material/Contacts";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  List,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChannelsResponse, User } from "../Types/ServerTypes";
import Api from "../Utility/Api";
import Urls from "../Utility/Urls";
import { useApi, useRefetchApi } from "../Utility/useApi";
import ChannelItem from "./ChannelItem";
import { AddFriendModal } from "./Modals/AddFriendModal";
import ContactsModal from "./Modals/ContactsModal";
import { CreateChannelModal } from "./Modals/CreateChannelModal";

const FriendsPanel = ({ close }: { close?: () => void }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const navigate = useNavigate();

  // Fetch all channels
  const { data: channels, isLoading, isError } = useRefetchApi<ChannelsResponse[]>(["getChannels"], Urls.Channels, { refetchInterval: 2000 });

  const { data: users } = useApi<User[]>(["getFriends"], Urls.Friends);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchData = useMemo<ChannelsResponse[] | undefined>(() => channels && filterChannels(channels), [searchTerm, channels]);

  const [isChannelModalOpen, setIsChannelModalOpen] = useState<boolean>(false);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState<boolean>(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState<boolean>(false);
  const [isLeaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveChannelId, setLeaveChannelId] = useState("");

  function filterChannels(value: ChannelsResponse[]): ChannelsResponse[] {
    return value?.filter((channel) => channel.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  const { uuid } = useParams<{ uuid: string }>();

  useEffect(() => {
    if (!uuid && channels && channels[0]) {
      navigate(channels[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels]);

  const leaveChannel = (id: string) => {
    setLeaveModalOpen(true);
    setLeaveChannelId(id);
  };

  return (
    <Stack
      sx={{
        mt: 2,
        mb: 2,
        bgcolor: "background.paper", // Use a theme color or specific hex color
        minHeight: "0vh", // Adjust based on your layout needs
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      }}
    >
      <Box
        sx={{
          m: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "left",
          backgroundColor: "transparent",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", height: 50 }}>
          <Typography variant="h5">Channels</Typography>
        </Box>
        <Divider />
        <Stack direction={"row"}>
          <TextField
            size="small"
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
                setIsContactsModalOpen(true);
              }}
            >
              <ContactsIcon />
            </IconButton>
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
      <List
        onClickCapture={close}
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
            <ChannelItem
              id={channel.id}
              username={channel.name}
              lastMessage={channel.lastMessage}
              profilePic={channel.picture}
              key={channel.id}
              leaveChannel={leaveChannel}
            />
          ))
        ) : (
          <Typography textAlign={"center"} py={4}>
            No channels found
          </Typography>
        )}
      </List>
      <CreateChannelModal users={users ?? []} open={isChannelModalOpen} handleClose={() => setIsChannelModalOpen(false)} />
      <AddFriendModal open={isAddFriendModalOpen} handleClose={() => setIsAddFriendModalOpen(false)} />
      <ContactsModal users={users ?? []} open={isContactsModalOpen} onClose={() => setIsContactsModalOpen(false)} />
      <Dialog fullScreen={false} open={isLeaveModalOpen} onClose={() => setLeaveModalOpen(false)}>
        <DialogTitle>Leave Channel {channels?.find((v) => v.id == leaveChannelId)?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to leave this channel?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" autoFocus onClick={() => setLeaveModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={async () => {
              setLeaveModalOpen(false);

              try {
                await Api.Delete(Urls.Channels + "?id=" + leaveChannelId);
                navigate("/");
              } catch (e) {
                enqueueSnackbar("Error leaving the channel", { variant: "error" });
              }
            }}
          >
            <b>Leave</b>
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default FriendsPanel;
