import { Box } from "@mui/material";

import { Outlet } from "react-router";
import Page from "src/components/Page";

const Index = () => {
  return (
    <>
      <Page title="blogs.title">
        <Box sx={{ pt: 2 }}>
          <Outlet />
        </Box>
      </Page>
    </>
  );
};

export default Index;
