import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Box, Modal, TextField, Typography, MenuItem, Autocomplete, Button, Stack } from "@mui/material";
import API from "../Utility/Api";

interface NewChatModalProps {
  open: boolean;
  handleClose: () => void;
}

interface Friend {
  username: string;
  picture: string;
}

function NewChatModal({ open, handleClose }: NewChatModalProps) {
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [chatName, setChatName] = useState(""); // State for the chat name

  // Fetch friends
  const { data, isFetching } = useQuery("getFriends", API.GetFriends, {
    enabled: open, // Fetch friends only when modal is open
  });

  useEffect(() => {
    if (data) {
      setFriends(data);
    }
  }, [data]);

  const handleRemoveFriend = (username: string) => {
    setSelectedFriends(selectedFriends.filter((friend) => friend.username !== username));
  };

  const handleFriendSelect = (event: any, newValue: string | null) => {
    const friend = friends.find((f) => f.username === newValue);
    if (friend && !selectedFriends.some((f) => f.username === friend.username)) {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const handleChatNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatName(event.target.value);
  };

  const handleSubmit = async () => {
    // Prepare the data for the new channel
    const newChannelData = {
      name: chatName,
      users: selectedFriends.map((friend) => friend.username), // Assuming you need the usernames
      // You may need to include other properties according to your backend requirements
    };

    try {
      // Call the API to create the new channel
      const newChannelId = await API.PostChannels(newChannelData);
      console.log("New channel created with ID:", newChannelId);

      // Handle the success response, such as closing the modal or refreshing the list of channels
      handleClose();
    } catch (error) {
      console.error("Failed to create new channel:", error);
      // Handle the error, such as showing a notification to the user
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="new-chat-modal-title" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box
        component="form"
        sx={{
          p: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          maxWidth: 400,
          width: "100%",
          margin: "auto",
        }}
      >
        <Typography id="new-chat-modal-title" variant="h6" component="h2">
          Create New Chat
        </Typography>

        {/* TextField for chat name */}
        <TextField sx={{ mb: 2 }} label="Chat Name" fullWidth margin="normal" value={chatName} onChange={handleChatNameChange} />

        <Autocomplete
          disablePortal
          options={friends.map((friend) => friend.username)}
          sx={{ mt: 2, width: "100%" }}
          renderInput={(params) => <TextField {...params} label="Select Friends" />}
          ListboxProps={{ style: { maxHeight: "10rem" } }}
          onChange={handleFriendSelect}
          disabled={isFetching}
        />

        {/* Display selected friends as buttons */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {selectedFriends.map((friend, index) => (
            <Button key={index} variant="outlined" onClick={() => handleRemoveFriend(friend.username)}>
              {friend.username}
            </Button>
          ))}
        </Stack>

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
          // onClick={/* define your submit function here */}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
}

export default NewChatModal;
