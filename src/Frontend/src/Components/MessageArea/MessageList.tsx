import GroupsIcon from "@mui/icons-material/Groups";
import { Box, IconButton, Typography } from "@mui/material";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ChannelResponse } from "../../Types/ServerTypes";
import Urls from "../../Utility/Urls";
import useApi from "../../Utility/useApi";
import LazyImage from "../LazyImage";

function MessageList() {
  const { uuid } = useParams<{ uuid: string }>();
  const { data, isLoading } = useApi<ChannelResponse[]>("getChannels", Urls.Channels);

  const getChannel = () => {
    return data?.find((channel) => channel.id === uuid);
  };

  const channel = useMemo(getChannel, [uuid, data]);

  return (
    <>
      <Box sx={{ borderBottom: 1, display: "flex", alignItems: "center" }}>
        <Typography sx={{ alignSelf: "center" }} variant="h5">
          <IconButton>
            <LazyImage src={channel?.picture} title="Profile Picture" sx={{ height: 32, width: 32 }} placeholder={<GroupsIcon />} />
          </IconButton>
          {channel?.name}
        </Typography>
      </Box>
      {/* Channel History */}
      <Box sx={{ flexGrow: 1 }}></Box>
    </>
  );
}

export default MessageList;
