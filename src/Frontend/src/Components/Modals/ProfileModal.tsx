import { Avatar, Dialog, DialogContent, Divider, Grid, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useAuth } from "../../Auth/useAuth";
import { Profile } from "../../Types/ServerTypes";
import Urls from "../../Utility/Urls";
import { useApi } from "../../Utility/useApi";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { user } = useAuth();

  const { data: whoami } = useApi<Profile>("profile", Urls.Profile, "Failed to get whoami", {
    refetchOnMount: "always",
  });

  useEffect(() => {
    document.title = import.meta.env.VITE_APP_TITLE + " - Profile";
  }, []);

  return (
    <Dialog onClose={onClose} open={open} sx={{ overflowY: "visible" }}>
      <Stack direction={"column"} justifyContent={"center"} alignItems={"center"}>
        <Avatar
          src={user.profilePicture}
          sx={{
            position: "absolute",
            top: -50,
            width: 110,
            height: 110,
            borderWidth: "10px",
            borderColor: "background.default",
            borderStyle: "solid",
            bgcolor: "background.default",
            ":before": "test",
          }}
        ></Avatar>
        <DialogContent sx={{ mt: 6 }}>
          <Typography align="center">@{whoami?.username}</Typography>

          <Divider sx={{ mt: 2, mb: 4 }} />

          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h5" align="center">
                <b>{whoami?.friends}</b>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" align="center">
                <b>{whoami?.channels}</b>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" align="center">
                Friends
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" align="center">
                Channels
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Stack>
    </Dialog>
  );
}

export default ProfileModal;
