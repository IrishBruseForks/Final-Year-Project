import { Avatar, Box, Grid, Stack, Typography } from "@mui/material";

type Props = {
  username: string;
};

function ChatItem({ username }: Props) {
  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      {/* Profile picture (Avatar component can be used here) */}
      <Avatar
        src=""
        alt="Profile Picture"
        sx={{ width: 60, height: 60, marginRight: 2 }}
      />

      {/* Name and other text stacked vertically */}
      <Stack direction="column" spacing={1}>
        <Typography variant="h6">{username}</Typography>
        <Typography variant="body2">Other Text Here</Typography>
      </Stack>
    </Box>
  );
}

export default ChatItem;
