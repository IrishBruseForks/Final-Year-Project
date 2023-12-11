import { Dialog } from "@mui/material";
import React, { useState } from "react";

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
