import React, { useState } from "react";
import { useQuery } from "react-query";
import { Box, Button, Modal, TextField, Typography, MenuItem } from "@mui/material";
import API from "../Utility/Api";

interface NewChatModalProps {
  open: boolean;
  handleClose: () => void;
}

interface User {
  id: string;
  username: string;
  picture: string;
}

function NewChatModal({ open, handleClose }: NewChatModalProps) {
  const [selectedContacts, setSelectedContacts] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch search results using react-query
  const { data: searchResults, isFetching } = useQuery(
    ['getFriends', searchTerm],
    () => API.GetFriends(searchTerm),
    {
      enabled: searchTerm.length > 0, // Only run the query if the search term is not empty
      keepPreviousData: true, // Optional: Keep previous data while new data is being fetched
    }
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddContact = (user: User) => {
    if (!selectedContacts.some((contact) => contact.id === user.id)) {
      setSelectedContacts([...selectedContacts, user]);
    }
  };

  const handleRemoveContact = (userId: string) => {
    setSelectedContacts(selectedContacts.filter((contact) => contact.id !== userId));
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

        <TextField
          label="Search Contacts"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={handleSearchChange}
          select
          autoComplete="off"
          disabled={isFetching}
        >
          {searchResults?.map((user) => (
            <MenuItem key={user.id} value={user.username} onClick={() => handleAddContact(user)}>
              {user.username}
            </MenuItem>
          ))}
        </TextField>

        {/* ... Additional components like the list of selected contacts, message field, etc. */}
        {/* ... */}
      </Box>
    </Modal>
  );
}

export default NewChatModal;