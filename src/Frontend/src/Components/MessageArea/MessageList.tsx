import GroupsIcon from "@mui/icons-material/Groups";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { format } from "date-fns";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChannelResponse, PostMessageResponse } from "../../Types/ServerTypes";
import Urls from "../../Utility/Urls";
import useApi from "../../Utility/useApi";
import LazyImage from "../LazyImage";

function MessageList({ messages }: { messages: PostMessageResponse[] | undefined }) {
  const { uuid } = useParams<{ uuid: string }>();
  const { data: channel } = useApi<ChannelResponse>(["getChannel", uuid], Urls.Channel + "?id=" + uuid);

  const getProfilePictureUrl = (message: PostMessageResponse) => {
    return (
      channel?.users.find((c) => {
        return c.id === message.sentBy;
      })?.picture || ""
    );
  };

  useEffect(() => {
    console.log(channel?.name);
  }, [channel?.name]);

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
          <Box key={message.sentOn} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar src={getProfilePictureUrl(message)} sx={{ mr: 1 }} />
            <Box>
              {/* {channel.users[0]} */}
              <Typography variant="body2">
                {
                  channel?.users.find((c) => {
                    return c.id === message.sentBy;
                  })?.username
                }
              </Typography>
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
