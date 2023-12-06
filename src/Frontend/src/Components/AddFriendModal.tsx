import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

interface AddFriendModalProps {
  open: boolean;
  handleClose: () => void;
}

export const AddFriendModal: React.FC<AddFriendModalProps> = ({ open, handleClose }) => {
  const [userId, setUserId] = useState<string>("");

  const handleAddFriend = () => {
    // Logic to handle adding a friend
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {/* ... */}
    </Dialog>
  );
};
