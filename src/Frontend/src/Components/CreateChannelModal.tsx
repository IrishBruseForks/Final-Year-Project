import { AccountCircle } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useAuth } from "../Auth/useAuth";
import { PostChannelBody, User } from "../Types/ServerTypes";
import Urls from "../Utility/Urls";
import { getApiConfig, useApi } from "../Utility/useApi";
import LazyImage from "./LazyImage";

// Constants for styling the Select component
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Define the props for the CreateChannelModal component
type CreateChannelModalProps = {
  open: boolean;
  handleClose: () => void;
  defaultChannelName: string;
};

// Create the CreateChannelModal component
export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ open, handleClose }) => {
  const { user } = useAuth();

  // State variables to manage form input and errors
  const [channelName, setChannelName] = useState<string>("");
  const [channelPicture, setChannelPicture] = useState<string>("");
  const [selectedUserID, setSelectedUserID] = useState<string[]>([]);

  const [selectError, setSelectError] = useState<boolean>(false); // State to track the select error

  // Query client for fetching data
  const queryClient = useQueryClient();

  const { data: users } = useApi<User[]>("getFriends", Urls.Friends, "Error getting friends list");

  // Handle changes in the selected users
  const handleUserChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedUserID(event.target.value as string[]);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (users === undefined) {
      return; // Do not proceed with channel creation
    }

    if (selectedUserID.length === 0) {
      setSelectError(true); // Set error if no users are selected
      return; // Do not proceed with channel creation
    }

    // Use the provided channel name, or default to joined usernames of selected users
    const finalChannelName = channelName.trim() || selectedUserID.map((id) => users.find((user) => user.id === id)?.username).join(", ");

    if (!finalChannelName) {
      console.error("Channel name cannot be empty.");
      return;
    }

    // Extract the user IDs from the selected usernames
    const userIds = selectedUserID;

    const finalChannelPicture = channelPicture;

    // Create the channel data object
    const channelData: PostChannelBody = {
      name: finalChannelName,
      users: userIds, // Use user IDs here
      picture: finalChannelPicture,
    };

    if (!user) return;

    try {
      // Send a POST request to create the channel
      await axios.post(import.meta.env.VITE_API_URL + Urls.Channels, channelData, getApiConfig(user));
      // Invalidate the queries to refresh the channel list
      queryClient.invalidateQueries("getChannels");
      // Close the modal
      handleClose();
    } catch (error) {
      console.error("Error creating channel: ", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create a New Channel</DialogTitle>
      <DialogContent>
        {/* Channel Name input */}
        <TextField
          autoFocus
          margin="dense"
          label="Channel Name"
          fullWidth
          variant="outlined"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />

        {/* Channel Picture URL input */}
        <TextField
          margin="dense"
          label="Channel Picture URL"
          fullWidth
          variant="outlined"
          value={channelPicture}
          onChange={(e) => setChannelPicture(e.target.value)}
          placeholder="Enter a picture URL or leave blank for default"
        />

        {/* Add User selection with checkboxes */}
        <FormControl fullWidth margin="dense" error={selectError}>
          <InputLabel id="multiple-checkbox-label">Add Users</InputLabel>
          <Select
            labelId="multiple-checkbox-label"
            id="multiple-checkbox"
            multiple
            value={selectedUserID}
            onChange={handleUserChange}
            input={<OutlinedInput label="Add Users" />}
            renderValue={(selected) => selected.map((id) => users?.find((user) => user.id === id)?.username).join(", ")}
            MenuProps={MenuProps}
          >
            {users?.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <LazyImage
                  src={user.picture}
                  title={user.username || "User"}
                  sx={{ height: "24px", marginRight: "8px", borderRadius: "50%" }}
                  placeholder={<AccountCircle />}
                />
                <ListItemText primary={user.username} />
                <Checkbox checked={selectedUserID.includes(user.id)} style={{ marginLeft: "auto" }} />
              </MenuItem>
            ))}
          </Select>
          {selectError && <FormHelperText>Please select at least one user.</FormHelperText>}
        </FormControl>
      </DialogContent>

      <DialogActions>
        {/* Cancel button */}
        <Button onClick={handleClose}>Cancel</Button>
        {/* Create button */}
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
