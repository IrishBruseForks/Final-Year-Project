import React from 'react';
import { useQuery } from 'react-query';
import { Dialog, DialogTitle, List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress, DialogContent } from '@mui/material';
import Api from '../../Utility/Api'; // Adjust the import path as necessary
import { User } from '../../Types/ServerTypes'; // Adjust the import path as necessary
import Urls from '../../Utility/Urls';

interface ContactsModalProps {
  open: boolean;
  onClose: () => void;
  users: User[];
}

const ContactsModal: React.FC<ContactsModalProps> = ({ open, onClose }) => {
  const fetchUsers = async (): Promise<User[]> => Api.Post<User[]>(Urls.Users, []);

  const { data: users, isLoading, isError } = useQuery<User[]>('users', fetchUsers, {
    enabled: open, // Fetch users only when the modal is open
  });

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>Contacts</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <List>
            {users?.map((user) => (
              <ListItem key={user.id} button>
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