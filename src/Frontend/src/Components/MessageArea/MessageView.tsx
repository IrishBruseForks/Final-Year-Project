import { Box, Typography, TextField, InputAdornment, Button, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

function MessageView() {
  return (
    <Box>
      <Box
        sx={{
          p: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "left",
          backgroundColor: "transparent",
        }}
      >
        <Box sx={{ borderBottom: 1, display: "flex", alignItems: "center" }}>
          <Typography sx={{ alignSelf: "center" }} variant="h5">
            Channel Name Here
          </Typography>
        </Box>
        <TextField
          size="medium"
          autoFocus
          margin="dense"
          label="Find a Channel"
          fullWidth
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button variant="contained" endIcon={<SendIcon />}>
                  Send
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Divider />
    </Box>
  );
}

export default MessageView;
