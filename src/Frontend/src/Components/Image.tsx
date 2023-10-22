import { Box, SxProps, Theme } from "@mui/material";

interface ImageProps {
  title: string;
  src: string;
  sx?: SxProps<Theme>;
}

function Image({ title, src, sx }: ImageProps) {
  return (
    <Box sx={sx}>
      <img src={src} title={title} style={{ width: "100%", height: "100%" }} loading="lazy" />
    </Box>
  );
}

export default Image;
