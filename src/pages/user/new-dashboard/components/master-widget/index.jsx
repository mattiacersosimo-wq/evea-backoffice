import { Grid } from "@mui/material";

import Item from "./components/item";
import useMasterWidget from "./hooks/use-master-widget";

const MasterWidget = () => {
  const data = useMasterWidget();
  return (
    <Grid container spacing={2}>
      <Grid item sm={4} xs={12}>
        <Item data={data.income} />
      </Grid>
      <Grid item sm={4} xs={12}>
        <Item data={data.expense} />
      </Grid>
      <Grid item sm={4} xs={12}>
        <Item data={data.balance} />
      </Grid>
    </Grid>
  );
};

export default MasterWidget;
