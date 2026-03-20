import { Box, Card, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Chart from "./components/chart";
import DateRangePicker from "./components/date-range-picker";
import useSalesGraph from "./hooks/use-sales-graph";

const SalesGraph = () => {
  const { t } = useTranslation();
  const { data, onDateChange, dateRange } = useSalesGraph();
  return (
    <>
      <Card sx={{ p: 2 }}>
        <Typography variant="subtitle2">{t("business.salesgraph")}</Typography>
        <DateRangePicker onChange={onDateChange} dateRange={dateRange} />
        <Box sx={{ height: "350px", pt: "30px" }}>
          <Chart data={data} />
        </Box>
      </Card>
    </>
  );
};

export default SalesGraph;
