import { Grid, Typography } from "@mui/material";

import ImageUpload from "./imageUpload";
import Translate from "src/components/translate";

const ChangeLogo = () => {
  return (
    <>
      <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
        <Translate>settings.brand.change_logo</Translate>
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ImageUpload title={"settings.brand.change_your_logo"} name="logo" />
        </Grid>
        <Grid item xs={12} md={6}>
          <ImageUpload
            title={"settings.brand.change_your_logo_icon"}
            name="favicon"
          />
        </Grid>
        {/* <Grid item xs={12} md={4}>
          <ImageUpload
            title={"settings.brand.sidebar_corner_logo"}
            name="side_bar_logo"
          />
        </Grid> */}
      </Grid>
    </>
  );
};

export default ChangeLogo;
