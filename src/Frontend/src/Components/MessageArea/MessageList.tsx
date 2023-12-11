import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ChannelResponse } from "../../Types/ServerTypes";
import API from "../../Utility/Api";

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
          {channel?.name}
        </Typography>
      </Box>
      {/* Channel History */}
      <Box sx={{ flexGrow: 1 }}>{channel?.picture}</Box>
    </>
  );
}

export default MessageList;
