import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import { Box, SxProps, Theme } from "@mui/material";
import { cloneElement, useRef, useState } from "react";

interface ImageProps {
  title?: string;
  src?: string;
  placeholder?: JSX.Element | null;
  sx?: SxProps<Theme>;
}

export default function LazyImage({ title, src, sx, placeholder = <BrokenImageIcon /> }: ImageProps) {
  const imgElement = useRef<HTMLImageElement>(null);

  const [loaded, setLoaded] = useState(false);

  const onloaded = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;

    setLoaded(true);
    setTimeout(() => {
      img.style.position = "relative";
      img.style.opacity = "1";
    }, 0);
  };

  return (
    <>
      {!loaded && cloneElement(placeholder ?? <Box />, { sx: sx })}
      {<Box component="img" ref={imgElement} src={src} title={title} loading="lazy" onLoad={onloaded} sx={{ opacity: 0, position: "absolute", ...sx }} />}
    </>
  );
}
