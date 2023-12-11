import {} from "@mui/material";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { ChannelResponse } from "../../Types/ServerTypes";
import API from "../../Utility/Api";

function MessageList() {
  const { uuid } = useParams<{ uuid: string }>();
  const { data, isLoading } = useQuery<ChannelResponse[]>("getChannels", () => API.GetChannels());
  const [channel, setChannel] = useState<ChannelResponse | undefined>(data?.filter((channel) => channel.id == uuid)[0]);

  useEffect(() => {
    setChannel(data?.filter((channel) => channel.id == uuid)[0]);
    console.log(data);
  }, [data]);

  console.log(uuid);
  return <>{}</>;
}

export default MessageList;
