import { Box, Grid } from "@mui/material";
import Days from "./components/days";
import Package from "./components/package";

const DataTable = () => {
  return (
    <>
      <Days />
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <Package />
      </Box>
    </>
  );
};

export default DataTable;
