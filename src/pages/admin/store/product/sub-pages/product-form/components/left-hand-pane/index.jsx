import { Card, Grid, Stack } from "@mui/material";
import { RHFTextField } from "src/components/hook-form";
import HideForPackage from "src/components/package-or-product/hide-for-package";
import ShowForPackage from "src/components/package-or-product/show-for-package";
import BasicInfo from "./components/basic-info";
import Description from "./components/description";
import MultiFileUpload from "./components/multi-file-upload";
import PriceAndBvs from "./components/price-and-bvs";
import ProductUrl from "./components/product-url";

const LeftHandPane = () => {
  return (
    <Grid item xs={12} md={7}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <BasicInfo />
          <Description />
          <ProductUrl />
          <MultiFileUpload />

          {/* <HideFromPackage> */}
          {/* <RHFTextField name="bv_percentage" label="global.bv_percentage" /> */}
          <RHFTextField
            name="qualification_value"
            label="global.qualification_value"
          />
          <RHFTextField name="euro_value" label="global.euro_value" />
          <RHFTextField name="business_volume" label="global.business_volume" />
          {/* </HideFromPackage> */}

          <HideForPackage>
            <PriceAndBvs />
          </HideForPackage>
          <ShowForPackage>
            <RHFTextField name="price" label="business.price" />
          </ShowForPackage>
        </Stack>
      </Card>
    </Grid>
  );
};
export default LeftHandPane;
