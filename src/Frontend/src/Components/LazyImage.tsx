import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import { Box, SxProps, Theme } from "@mui/material";
import { useRef, useState } from "react";

interface ImageProps {
  title?: string;
  src?: string;
  placeholder?: JSX.Element;
  sx?: SxProps<Theme>;
}

export default function LazyImage({ title, src, sx, placeholder = <BrokenImageIcon /> }: ImageProps) {
  const imgElement = useRef<HTMLImageElement>(null);

  const [loaded, setLoaded] = useState(false);

  const onloaded = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    img.style.opacity = "1";
    setLoaded(true);
  };

  return (
    <Box sx={sx}>
      {!loaded && placeholder}
      {
        <img
          ref={imgElement}
          src={src}
          title={title}
          style={{ opacity: 0, width: "100%", height: "100%", position: "relative" }}
          loading="lazy"
          onLoad={onloaded}
        />
      }
    </Box>
  );
}
