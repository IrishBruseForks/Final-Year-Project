import { Grid } from "@mui/material";
import { ReactNode } from "react";

function Centered({ children }: { children: ReactNode }) {
  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid container alignItems="center" direction="column">
          {children}
        </Grid>
      </Grid>
    </>
  );
}

export default Centered;
