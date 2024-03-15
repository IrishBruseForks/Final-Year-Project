import { Avatar, CircularProgress, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import React from "react";
import { User } from "../../Types/ServerTypes"; // Adjust the import path as necessary
import Urls from "../../Utility/Urls";
import { useApi } from "../../Utility/useApi";

interface ContactsModalProps {
  open: boolean;
  onClose: () => void;
  users: User[];
}

const ContactsModal: React.FC<ContactsModalProps> = ({ open, onClose }) => {
  const { data: users, isLoading } = useApi<User[]>("getFriends", Urls.Friends, "Error getting friends list");

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>Friends</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <List>
            {users?.map((user) => (
              <ListItem key={user.id}>
                <ListItemAvatar>
                  <Avatar alt={user.username} src={user.picture} />
                </ListItemAvatar>
                <ListItemText primary={user.username} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactsModal;
