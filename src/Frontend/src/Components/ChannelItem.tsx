import { GroupsRounded } from "@mui/icons-material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Box, ListItemButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LazyImage from "./LazyImage";

type Props = {
  id: string;
  username: string;
  lastMessage?: string;
  profilePic: string;
};

function ChannelItem({ id, username, lastMessage, profilePic }: Props) {
  const navigate = useNavigate();
  var { uuid } = useParams<{ uuid: string }>();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  return (
    <>
      <ListItemButton
        sx={{ width: "100%", cursor: "pointer" }}
        selected={id === uuid}
        onClick={() => {
          navigate("/" + id);
        }}
        onContextMenu={handleContextMenu}
      >
        <Box display={"grid"} alignItems={"center"} gridTemplateColumns={"1fr auto"}>
          {/* Profile picture */}
          <Box gridRow={"span 2"}>
            <LazyImage
              src={profilePic}
              placeholder={<GroupsRounded />}
              sx={{ bgcolor: "background.default", width: 60, height: 60, marginRight: 2, borderRadius: "50%" }}
            />
          </Box>

          {/* Name and other text stacked vertically */}
          <Typography noWrap variant="h6">
            {username}
          </Typography>
          <Typography noWrap color={"text.secondary"} sx={{ maxWidth: "200px" }}>
            {lastMessage ?? ""}
          </Typography>
        </Box>

        <Menu
          open={contextMenu !== null}
          onClose={() => setContextMenu(null)}
          anchorReference="anchorPosition"
          anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
        >
          <MenuItem
            onClick={() => {
              setTimeout(() => {
                setContextMenu(null);
              }, 200);
            }}
          >
            Leave Channel&nbsp;
            <ExitToAppIcon />
          </MenuItem>
        </Menu>
      </ListItemButton>
    </>
  );
}

export default ChannelItem;
