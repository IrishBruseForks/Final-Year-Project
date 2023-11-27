import { Avatar, Box, Divider, ListItemButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string;
  username: string;
  lastMessage: string;
  profilePic: string;
};

function ChannelItem({ id, username, lastMessage, profilePic }: Props) {
  const navigate = useNavigate();
  return (
    <>
      <ListItemButton
        onClick={() => {
          navigate("/" + id);
        }}
      >
        <Box display={"grid"} alignItems={"center"} gridTemplateColumns={"1fr auto"}>
          {/* Profile picture (Avatar component can be used here) */}
          <Box gridRow={"span 2"}>
            <Avatar src={profilePic} alt="Profile Picture" sx={{ width: 60, height: 60, marginRight: 2 }} />
          </Box>

          {/* Name and other text stacked vertically */}
          <Typography noWrap variant="h6">
            {username}
          </Typography>
          <Typography noWrap color={"text.secondary"}>
            {lastMessage}
          </Typography>
        </Box>
      </ListItemButton>
      <Divider />
    </>
  );
}

export default ChannelItem;
