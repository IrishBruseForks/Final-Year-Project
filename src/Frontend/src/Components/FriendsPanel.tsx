import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Divider, IconButton, TextField, Typography, List, InputAdornment } from "@mui/material";
import { useQuery } from "react-query";
import API from "../Utility/Api";
import { AddFriendModal } from "./AddFriendModal";
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

  // Fetch all channels
  const { data, isLoading } = useQuery<ChannelResponse[]>("getChannels", () => API.GetChannels());

  // Filter channels based on the search term
  const filteredChannels = data?.filter((channel: ChannelResponse) => channel.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const [isChannelModalOpen, setIsChannelModalOpen] = useState<boolean>(false);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState<boolean>(false);

  function searchChannels(value: string): void {
    setSearchTerm(value);
    console.log(data);

    const filtered = data?.filter((channel) => channel.name.toLowerCase().includes(searchTerm.toLowerCase()));

    setSearchData(filtered);
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
      <List sx={{ maxHeight: "calc(89vh - 160px)", overflowY: "auto" }}>
        {!isLoading && filteredChannels && filteredChannels.length > 0 ? (
          filteredChannels.map((channel: ChannelResponse) => (
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
