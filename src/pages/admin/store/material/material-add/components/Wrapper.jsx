import { Box, Card, Grid } from "@mui/material";
import Page from "src/components/Page";

import BreadCrumps from "./bread-crumps";

const Wrapper = ({ children }) => {
  return (
    <Page title={"adminStore.material.materialStore"}>
      <Box sx={{ p: 2 }}>
        <BreadCrumps />
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>{children}</Card>
        </Grid>
      </Box>
    </Page>
  );
};
export default Wrapper;
