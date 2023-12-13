import GroupsIcon from "@mui/icons-material/Groups";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { format } from "date-fns";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ChannelResponse } from "../../Types/ServerTypes";
import Constants from "../../Utility/Constants";
import Urls from "../../Utility/Urls";
import useApi from "../../Utility/useApi";
import LazyImage from "../LazyImage";

function MessageList({ messages }: { messages: any[] | undefined }) {
  const { uuid } = useParams<{ uuid: string }>();
  const { data } = useApi<ChannelResponse[]>("getChannels", Urls.Channels);

  const getChannel = () => {
    return data?.find((channel) => channel.id === uuid);
  };

  const channel = useMemo(getChannel, [uuid, data]);

  const getProfilePictureUrl = () => {
    return localStorage.getItem(Constants.ProfilePictureKey) || "";
  };

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
        {messages?.map((message) => (
          <Box key={message.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar src={getProfilePictureUrl()} sx={{ mr: 1 }}>
              {message.sentBy[0]}
            </Avatar>
            <Box>
              <Typography variant="body2">{message.sentBy}</Typography>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(message.sentOn), "PPpp")}
              </Typography>
              <Typography variant="body1">{message.content}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}

export default MessageList;
