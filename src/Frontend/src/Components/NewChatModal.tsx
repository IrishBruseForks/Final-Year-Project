import { Box, Button, List, ListItem, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

interface NewChatModalProps {
  open: boolean;
  handleClose: () => void;
}

function NewChatModal({ open, handleClose }: NewChatModalProps) {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]); // Mocked search results

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Implement the actual search logic for contacts here - API Call
    // Demonstration below for searching users - will be deleted eventually
    if (value) {
      setSearchResults(["Mario", "Luigi", "Ash"].filter((user) => user.toLowerCase().includes(value.toLowerCase())));
    } else {
      setSearchResults([]);
    }
  };

  const handleAddContact = (contact: string) => {
    if (!selectedContacts.includes(contact)) {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleRemoveContact = (contact: string) => {
    setSelectedContacts(selectedContacts.filter((c) => c !== contact));
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="new-chat-modal-title" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box
        sx={{
          p: 1, // Padding
          display: "flex", // Use flexbox
          flexDirection: "column", // Stack children vertically
          justifyContent: "center", // Center content vertically in the box
          alignItems: "center", // Center content horizontally
          backgroundColor: "background.paper", // Background color
          borderRadius: 2, // Border radius
          boxShadow: 24, // Box shadow
          maxWidth: 400, // Maximum width
          width: "100%", // Full width
          margin: "auto", // Auto margins for centering
        }}
      >
        <Typography id="new-chat-modal-title" variant="h6" component="h2">
          Start New Chat
        </Typography>

        {/* Search Bar for Contacts */}
        <TextField label="Search Contacts" fullWidth margin="normal" value={searchTerm} onChange={handleSearchChange} />

        {/* Search Results - will display the contacts that have been selected */}
        <List>
          {searchResults.map((contact, index) => (
            <ListItem key={index} button onClick={() => handleAddContact(contact)}>
              {contact}
            </ListItem>
          ))}
        </List>

        {/* Display Selected Contacts */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Selected Contacts:
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {selectedContacts.map((contact, index) => (
            <Box
              key={index}
              sx={{
                p: 1,
                border: "1px solid",
                borderRadius: "4px",
                cursor: "pointer", // Style for cursor. Done manually as it is automatically done for other components
              }}
              onClick={() => handleRemoveContact(contact)}
            >
              {contact}
            </Box>
          ))}
        </Box>
        {/* Message Input */}
        <TextField label="Message" fullWidth margin="normal" multiline rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />

        {/* Send Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            /* send message logic will go here*/
          }}
          disabled={selectedContacts.length === 0} // Enables send button only if a contact has been selected
        >
          Send
        </Button>
      </Box>
    </Modal>
  );
}

export default NewChatModal;
