import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Stack } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { FormProvider } from "src/components/hook-form";
import Translate from "src/components/translate";
import { PATH_DASHBOARD } from "src/routes/paths";
import AdminFee from "./components/admin-fee";
import Available from "./components/available-coins";
import AvailablePayout from "./components/available-payout";
import WithdrawalText from "./components/withdrawal-text";
import useWithdrawal from "./hooks/use-withdrawal";

const Withdraw = () => {
  const { onSubmit, methods } = useWithdrawal();

  return (
    <>
      <Page title={"settings.withdrawal.title"}>
        <Box>
          <HeaderBreadcrumbs
            heading={"settings.withdrawal.title"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              {
                name: "settings.withdrawal.title",
                href: PATH_DASHBOARD.settings.network.root,
              },
            ]}
          />
          <Card sx={{ p: 4 }}>
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <Grid container spacing={2}>
                <Grid container spacing={2} item xs={12} sm={6} md={6}>
                  <Grid item xs={12}>
                    <AvailablePayout />
                  </Grid>
                  <Grid item xs={12}>
                    <Available />
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <AdminFee />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <WithdrawalText />
                </Grid>
              </Grid>
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  loading={methods.formState.isSubmitting}
                  variant="contained"
                  type="submit"
                >
                  <Translate>{"settings.network.update"}</Translate>
                </LoadingButton>
              </Stack>
            </FormProvider>
          </Card>
        </Box>
      </Page>
    </>
  );
};

export default Withdraw;
