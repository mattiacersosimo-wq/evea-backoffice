import { Box, Card, Grid } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import Form from "./components/Form";
import useCrumps from "./utils/crumps";

const AddSubAdmin = () => {
  const crumps = useCrumps();

  return (
    <>
      <Page title={"sub_admin.sub_admins_title"}>
        <Box>
          <HeaderBreadcrumbs
            heading={"sub_admin.add_sub_admin"}
            links={crumps}
          />
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Form />
            </Card>
          </Grid>
        </Box>
      </Page>
    </>
  );
};

export default AddSubAdmin;
