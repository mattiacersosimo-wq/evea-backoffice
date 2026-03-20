import { LoadingButton } from "@mui/lab";
import { Card, Grid, Stack } from "@mui/material";

import {
  FormProvider,
  RHFEditor,
  RHFTextField,
} from "src/components/hook-form";

import LabelStyle from "src/components/label-style";

import AccessScope from "./component/AccessScope";
import EventType from "./component/EventType";
import HostDetails from "./component/HostDetails";
import TimeInfo from "./component/TimeInfo";
import ProductId from "./component/product-id";
import Translate from "src/components/translate";

const Form = ({ methods, onSubmit }) => {
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            {/* <AccessScope /> */}
            <Stack spacing={3}>
              {/* <ProductId /> */}
              <EventType />

              <RHFTextField
                name="zoom_password"
                label={"events.add_event.zoomPassword"}
              />
              <RHFTextField
                name="location_url"
                label={"events.add_event.location_Zoom"}
              />
              <div>
                <LabelStyle>
                  <Translate>events.add_event.description</Translate>
                </LabelStyle>
                <RHFEditor
                  simple
                  name="description"
                  sx={{ marginTop: "1rem" }}
                />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <TimeInfo />
            <HostDetails />
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={methods.formState.isSubmitting}
              name="submit"
            >
              <Translate>events.add_event.submit</Translate>
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
};
export default Form;
