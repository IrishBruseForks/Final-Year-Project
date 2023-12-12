import GroupsIcon from "@mui/icons-material/Groups";
import { Box, IconButton, Typography } from "@mui/material";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ChannelResponse } from "../../Types/ServerTypes";
import Urls from "../../Utility/Urls";
import useApi from "../../Utility/useApi";
import LazyImage from "../LazyImage";
import MessageView from "./MessageView";

function MessageList({ messages }: { messages: any[]|undefined }) {
  const { uuid } = useParams<{ uuid: string }>();
  const { data } = useApi<ChannelResponse[]>("getChannels", Urls.Channels);

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
      <Box sx={{ flexGrow: 1 }}>
        {messages?.map((message, _) => (
          <div key={message.id}>{message.content}</div>
        ))}
      </Box>
    </>
  );
}

export default MessageList;
