import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  OutlinedInput,
  ListItemText,
  FormHelperText,
} from "@mui/material";
import API from "../Utility/Api";
import { useQueryClient } from "react-query";
import { PostChannelBody, Friend } from "../Types/ServerTypes";
import Constants from "../Utility/Constants";

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
export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ open, handleClose, defaultChannelName }) => {
  // State variables to manage form input and errors
  const [channelName, setChannelName] = useState<string>("");
  const [channelPicture, setChannelPicture] = useState<string>("");
  const [selectedUserID, setSelectedUserID] = useState<string[]>([]);
  const [users, setUsers] = useState<Friend[]>([]);
  const [selectError, setSelectError] = useState<boolean>(false); // State to track the select error

  // Query client for fetching data
  const queryClient = useQueryClient();

  // Fetch the list of friends when the modal is opened
  useEffect(() => {
    if (open) {
      API.GetFriends()
        .then((fetchedUsers) => {
          setUsers(fetchedUsers);
        })
        .catch((error) => console.error("Error fetching users: ", error));
    }
  }, [open]);

  // Handle changes in the selected users
  const handleUserChange = (event: { target: { value: any } }) => {
    setSelectError(false); // Reset the error state when user makes a selection
    const {
      target: { value },
    } = event;
    setSelectedUserID(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (selectedUserID.length === 0) {
      setSelectError(true); // Set error if no users are selected
      return; // Do not proceed with channel creation
    }

    // Map the selected usernames to user IDs
    // const selectedUserIds = selectedUserID.map((username) => users.find((user) => user.username === username)?.id);

    // Filter out any potential undefined values and join the usernames
    const finalChannelName = channelName.trim() || selectedUserID.join(", ");

    // If finalChannelName is still empty at this point, log an error and return
    if (!finalChannelName) {
      console.error("Channel name cannot be empty.");
      return;
    }

    // Extract the user IDs from the selected usernames
    const userIds = users.filter((user) => selectedUserID.includes(user.username)).map((user) => user.id);

    const finalChannelPicture = channelPicture || localStorage.getItem(Constants.ProfilePictureKey) || "default_picture_url";

    // Create the channel data object
    const channelData: PostChannelBody = {
      name: finalChannelName,
      users: userIds, // Use user IDs here
      picture: finalChannelPicture,
    };

    try {
      // Send a POST request to create the channel
      await API.PostChannels(channelData);
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
        {/* User selection with checkboxes */}
        <FormControl fullWidth margin="dense" error={selectError}>
          <InputLabel id="multiple-checkbox-label">Add Users</InputLabel>
          <Select
            labelId="multiple-checkbox-label"
            id="multiple-checkbox"
            multiple
            value={selectedUserID}
            onChange={handleUserChange}
            input={<OutlinedInput label="Add Users" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {/* List of users with checkboxes */}
            {users.map((user) => (
              <MenuItem key={user.id} value={user.username}>
                <img src={user.picture} alt={user.username || "User"} style={{ height: "24px", marginRight: "8px", borderRadius: "50%" }} />
                <ListItemText primary={user.username} />
                <Checkbox checked={selectedUserID.includes(user.username)} style={{ marginLeft: "auto" }} />
              </MenuItem>
            ))}
          </Select>
          {/* Error message if no users are selected */}
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
