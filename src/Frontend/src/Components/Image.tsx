import { Box, SxProps, Theme } from "@mui/material";

interface ImageProps {
  alt: string;
  src: string;
  sx?: SxProps<Theme>;
}

function Image({ alt, src, sx }: ImageProps) {
  return (
    <Box sx={sx}>
      <img src={src} alt={alt} title={alt} style={{ width: "100%", height: "100%" }} />
    </Box>
  );
}

export default Image;
