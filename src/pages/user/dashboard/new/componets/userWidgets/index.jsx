import { Grid } from "@mui/material";
import { capitalCase } from "change-case";
import ReportWidget from "../widgets/ReportWidget";
import useUserWidget from "./hooks/useUserWidget";
import widgets from "./widgets";

const notNeeded = ["ewallet", "deposit_wallet"];

const UserWidgets = () => {
  const data = useUserWidget();
  return Object.entries(data).map(([k, v]) => {
    if (notNeeded.includes(k)) return null;
    return (
      <Grid item xs={6} md={4}>
        <ReportWidget
          icon={widgets[k]}
          total={parseInt(v || 0)}
          title={capitalCase(k)}
        />
      </Grid>
    );
  });
};

export default UserWidgets;
