import { useRef } from "react";
import "./Image.css";
import { Box } from "@mui/material";

type Props = {
  src: string;
  width: string;
  height?: string;
  alt: string;
  eager?: boolean;
};

function Image({ src, width, height, alt, eager }: Props) {
  const inputRef = useRef<HTMLImageElement>(null);

  const loaded = () => {
    inputRef.current?.parentElement?.classList.add("loaded");
  };

  return (
    <Box
      sx={{
        width: width,
        height: height,
        position: "relative",
      }}
    >
      {!eager ? (
        <>
          <img
            alt={alt}
            title={alt}
            className="image placeholder"
            src={src.replace(".png", "_sm.png")}
          />
          <img
            alt={alt}
            title={alt}
            className="image fullsize"
            ref={inputRef}
            src={src}
            loading="lazy"
            onLoad={loaded}
          />
        </>
      ) : (
        <img
          alt={alt}
          title={alt}
          className="image"
          ref={inputRef}
          src={src}
          loading="eager"
        />
      )}
    </Box>
  );
}

export default Image;
