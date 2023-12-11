import { Box, IconButton, Typography } from "@mui/material";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ChannelResponse } from "../../Types/ServerTypes";
import API from "../../Utility/Api";
import LazyImage from "../LazyImage";

function MessageList() {
  const { uuid } = useParams<{ uuid: string }>();
  const { data, isLoading } = useQuery<ChannelResponse[]>("getChannels", () => API.GetChannels());

  const getChannel = () => {
    return data?.find((channel) => channel.id === uuid);
  };

  const channel = useMemo(getChannel, [uuid, data]);

  return (
    <>
      <Box sx={{ borderBottom: 1, display: "flex", alignItems: "center" }}>
        <Typography sx={{ alignSelf: "center" }} variant="h5">
          <IconButton>
            <LazyImage src={channel?.picture} title="Profile Picture" sx={{ height: 32, width: 32 }} />
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
