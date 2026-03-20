import { Grid, Paper } from "@mui/material";
import RouteContainer from "./RouteContainer";
import SideBar from "./sideBar";

const RouteWrapper = ({ children }) => {
  return (
    <>
      <RouteContainer>
        <SideBar />
        <Grid item xs={12} sm={9} md={9}>
          <Paper elevation={0}>{children}</Paper>
        </Grid>
      </RouteContainer>
    </>
  );
};

export default RouteWrapper;
