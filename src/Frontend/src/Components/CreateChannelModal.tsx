import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import API from "../Utility/Api";
import { useQueryClient } from "react-query";
import { PostChannelBody } from "../Types/ServerTypes";

type CreateChannelModalProps = {
  open: boolean;
  handleClose: () => void;
  defaultChannelName: string;
};

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ open, handleClose, defaultChannelName }) => {
  const [channelName, setChannelName] = useState<string>("");
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    // Use the entered channel name, or default to the user's name if the input is empty or whitespace
    const finalChannelName = channelName.trim() || defaultChannelName;
    console.log(finalChannelName);
    console.log(defaultChannelName);

    try {
      const channelData: PostChannelBody = {
        name: finalChannelName, // Set the channel name
        users: [], // If users are needed, populate this array
        picture: "https://static.wikia.nocookie.net/the-official-big-lez-show/images/e/eb/Choomah.jpg/revision/latest?cb=20150831114837",
      };

      await API.PostChannels(channelData);
      queryClient.invalidateQueries("getChannels"); // Refresh the channel list
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error creating channel: ", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create a New Channel</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Channel Name"
          fullWidth
          variant="outlined"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};
