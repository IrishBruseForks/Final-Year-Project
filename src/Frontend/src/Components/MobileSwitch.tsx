import { useMediaQuery } from "@mui/material";

function MobileSwitch(args: { mobile: JSX.Element; desktop: JSX.Element }) {
  const isMobile = !useMediaQuery("(min-width:900px)");
  console.log(isMobile);

  if (isMobile) {
    return args.mobile;
  }

  return args.desktop;
}

export default MobileSwitch;
