import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField } from "@mui/material";
import { AxiosError } from "axios";
import React, { useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { UsernameBody } from "../../Types/ServerTypes";
import Api from "../../Utility/Api";
import Urls from "../../Utility/Urls";

export default function SimpleAlert() {
  return (
    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
      Here is a gentle confirmation that your action was successful.
    </Alert>
  );
}
interface AddFriendModalProps {
  open: boolean;
  handleClose: () => void;
}

export const AddFriendModal: React.FC<AddFriendModalProps> = ({ open, handleClose }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  async function handleSubmit() {
    if (!username) {
      return;
    }

    try {
      await Api.Post<UsernameBody>(Urls.Friends, { username: username });
      handleClose();
      setUsername(null);
      queryClient.invalidateQueries("getFriends");
    } catch (error) {
      if (error instanceof AxiosError) {
        let networkError = error.response?.data.message;
        setNetworkError(networkError);
      }
    }
  }

  const close = () => {
    setTimeout(() => {
      setUsername(null);
    }, 150);
    handleClose();
  };

  const validateUsername = useMemo(() => {
    if (username == null) {
      return null;
    }

    if (username.length < 3) {
      return "Username is too short.";
    }

    if (username.length > 20) {
      return "Username is too long.";
    }

    if (username.match(/^[a-zA-Z0-9_]+$/) == null) {
      return "Username contains invalid character.";
    }

    return networkError;
  }, [username, networkError]);

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Add new friend</DialogTitle>

      <DialogContent>
        <TextField
          onChange={(e) => {
            if (username) {
              setNetworkError(null);
            }
            setUsername(e.target.value);
          }}
          error={validateUsername != null}
          InputProps={{
            startAdornment: <InputAdornment position="start">@</InputAdornment>,
          }}
          label="Friend"
          margin="dense"
          fullWidth
          variant="outlined"
        />
        {validateUsername && (
          <Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
            {validateUsername}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        {/* Cancel button */}
        <Button onClick={close}>Cancel</Button>
        {/* Create button */}
        <Button disabled={username == null || validateUsername != null} onClick={handleSubmit} color="primary" variant="contained">
          Add Friend
        </Button>
      </DialogActions>
    </Dialog>
  );
};
