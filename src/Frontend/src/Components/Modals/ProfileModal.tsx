import UploadIcon from "@mui/icons-material/Upload";
import { Avatar, Button, Dialog, DialogContent, Divider, Grid, Stack, SxProps, Theme, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Profile } from "../../Types/ServerTypes";
import Api from "../../Utility/Api";
import Urls from "../../Utility/Urls";
import { useApi } from "../../Utility/useApi";
import ImageUpload from "../ImageUpload";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const AvatarUploadButton = {
  ":hover .MuiSvgIcon-root": {
    opacity: 1,
  },
  ":hover .MuiAvatar-root": {
    filter: "brightness(75%)",
  },
};

const AvatarStyles: SxProps<Theme> = {
  position: "absolute",
  width: 110,
  height: 110,
  borderWidth: "10px",
  borderColor: "background.default",
  borderStyle: "solid",
  bgcolor: "background.default",
  transition: "filter .2s",
};

function ProfileModal({ open, onClose }: ProfileModalProps) {
  const queryClient = useQueryClient();
  const { uuid } = useParams<{ uuid: string }>();

  const { data: whoami } = useApi<Profile>(["profile"], Urls.Profile, {});

  useEffect(() => {
    document.title = import.meta.env.VITE_APP_TITLE + " - Profile";
  }, []);

  useEffect(() => {
    if (open) {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  }, [open]);

  return (
    <Dialog onClose={onClose} open={open} sx={{ overflowY: "visible" }}>
      <Stack direction={"column"} justifyContent={"center"} alignItems={"center"}>
        <Button component="label" sx={AvatarUploadButton}>
          <Avatar src={whoami?.picture} sx={AvatarStyles}></Avatar>
          <UploadIcon sx={{ zIndex: 10, opacity: 0, transition: "opacity .2s" }} fontSize="large" color="primary" />
          <ImageUpload
            onChange={(img) => {
              Api.Put(Urls.Profile, { picture: img }).then(() => {
                queryClient.invalidateQueries({ queryKey: ["profile"] });
                queryClient.invalidateQueries({ queryKey: ["getChannel", uuid] });
              });
            }}
          />
        </Button>
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
