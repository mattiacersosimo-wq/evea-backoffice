import { LoadingButton } from "@mui/lab";
import { Grid, Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";

import HideForPackage from "src/components/package-or-product/hide-for-package";
import Translate from "src/components/translate";
import Video from "./Video";
import DocUpload from "./doc-upload";
import ProductAvailable from "./product-available";
import SubscriptionTypes from "./subscription-type";

const RightHandPane = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <Grid item xs={12} md={5}>
      <Stack spacing={3}>
        <ProductAvailable />
        {/* <PaymentTypes /> */}
        <HideForPackage>
          <SubscriptionTypes />
        </HideForPackage>
        <HideForPackage>
          <Video />
        </HideForPackage>
        <HideForPackage>
          <DocUpload />
        </HideForPackage>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          name="submit"
        >
          <Translate>products.add.submit</Translate>
        </LoadingButton>
      </Stack>
    </Grid>
  );
};

export default RightHandPane;
