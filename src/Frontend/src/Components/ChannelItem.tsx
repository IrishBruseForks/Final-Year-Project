import { GroupsRounded } from "@mui/icons-material";
import { Box, ListItemButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LazyImage from "./LazyImage";

type Props = {
  id: string;
  username: string;
  lastMessage?: string;
  profilePic: string;
};

function ChannelItem({ id, username, lastMessage, profilePic }: Props) {
  const navigate = useNavigate();

  return (
    <>
      <ListItemButton
        sx={{ width: "100%", bgcolor: "background.paper" }}
        onClick={() => {
          navigate("/" + id);
        }}
      >
        <Box display={"grid"} alignItems={"center"} gridTemplateColumns={"1fr auto"}>
          {/* Profile picture */}
          <Box gridRow={"span 2"}>
            <LazyImage src={profilePic} placeholder={<GroupsRounded />} sx={{ width: 60, height: 60, marginRight: 2, borderRadius: "50%" }} />
          </Box>

          {/* Name and other text stacked vertically */}
          <Typography noWrap variant="h6">
            {username}
          </Typography>
          <Typography noWrap color={"text.secondary"} sx={{ maxWidth: "200px" }}>
            {lastMessage ?? ""}
          </Typography>
        </Box>
      </ListItemButton>
    </>
  );
}

export default ChannelItem;
