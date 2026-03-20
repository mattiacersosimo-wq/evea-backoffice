import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import Scrollbar from "src/components/Scrollbar";
import SalesItem from "./components/sales-item";
import useSalesOverView from "./hooks/use-sales-overview";

const SalesOverview = () => {
  const { t } = useTranslation();
  const { past_month, past_week, this_month, this_week, this_year, today } =
    useSalesOverView();

  return (
    <Card sx={{ display: "flex", alignItems: "center", p: 2, height: "100%" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">
          {t("business.salesOverView")}
        </Typography>
        <Stack sx={{ pt: 2 }}>
          <Scrollbar sx={{ height: { md: "220px", xs: "auto" } }}>
            <Grid container spacing={1.5}>
              <SalesItem amount={today} type="today" />

              <SalesItem amount={this_month} type="this_month" />

              <SalesItem amount={this_week} type="this_week" />

              <SalesItem amount={past_month} type="past_month" />

              <SalesItem amount={past_week} type="past_week" />

              <SalesItem amount={this_year} type="this_year" />
            </Grid>
          </Scrollbar>
        </Stack>
      </Box>
    </Card>
  );
};

export default SalesOverview;
