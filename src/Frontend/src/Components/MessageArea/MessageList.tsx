import {} from "@mui/material";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

function MessageList() {
  const { uuid } = useParams<{ uuid: string }>();

  console.log(uuid);
  return <>{uuid}</>;
}

export default MessageList;