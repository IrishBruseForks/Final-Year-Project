import { AccountCircle, GroupsRounded } from "@mui/icons-material";
import UploadIcon from "@mui/icons-material/Upload";
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
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useAuth } from "../../Auth/useAuth";
import { PostChannelBody, User } from "../../Types/ServerTypes";
import Api from "../../Utility/Api";
import Urls from "../../Utility/Urls";
import ImageUpload from "../ImageUpload";
import LazyImage from "../LazyImage";

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
  users: User[];
};

// Create the CreateChannelModal component
export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ open, handleClose, users }) => {
  const { user } = useAuth();

  // State variables to manage form input and errors
  const [channelName, setChannelName] = useState<string>("");
  const [channelPicture, setChannelPicture] = useState<string | undefined>();
  const [selectedUserID, setSelectedUserID] = useState<string[]>([]);

  const [selectError, setSelectError] = useState<boolean>(false); // State to track the select error

  // Query client for fetching data
  const queryClient = useQueryClient();

  // Handle changes in the selected users
  const handleUserChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedUserID(event.target.value as string[]);
  };

  function close() {
    setTimeout(() => {
      setChannelName("");
      setChannelPicture("");
      setSelectedUserID([]);
      setSelectError(false);
    }, 100);
    handleClose();
  }

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

    // Create the channel data object
    const channelData: PostChannelBody = {
      name: finalChannelName,
      users: userIds, // Use user IDs here
      picture: channelPicture,
    };

    if (!user) return;

    try {
      // Send a POST request to create the channel
      await Api.Post(Urls.Channels, channelData);
      // Invalidate the queries to refresh the channel list
      queryClient.invalidateQueries({ queryKey: ["getChannels"] });
      // Close the modal
      close();
    } catch (error) {
      console.error("Error creating channel: ", error);
    }
  };

  return (
    <Dialog open={open} onClose={close}>
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

        {/* Channel Picture URL input */}
        <FormControl fullWidth error={selectError} sx={{ mt: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Button fullWidth id="file-upload" variant="outlined" component="label" sx={{ borderRadius: 1, mr: 2, p: 2 }}>
            <UploadIcon />
            <ImageUpload
              onChange={(image) => {
                setChannelPicture(image);
              }}
            />
          </Button>
          <LazyImage
            src={"data:image/png;base64, " + channelPicture}
            sx={{ height: 58, width: 58, backgroundColor: "background.paper", borderRadius: 1, p: 1, mr: 2 }}
            placeholder={<GroupsRounded />}
          />
        </FormControl>
      </DialogContent>

      <DialogActions>
        {/* Cancel button */}
        <Button onClick={close}>Cancel</Button>
        {/* Create button */}
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
