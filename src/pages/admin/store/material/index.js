import { Box, Card } from "@mui/material";
import Page from "src/components/Page";
import PaginationButtons from "src/components/pagination";

import HeaderBar from "./HeaderBar";
import MaterialTable from "./MaterialTable";
import useMaterials from "./hooks/useMaterials";

const Index = () => {
  const { state, rowStart, ...rest } = useMaterials();

  return (
    <div>
      <Page title={"material.title"}>
        <Box sx={{ p: 2 }}>
          <HeaderBar />
          <Card sx={{ p: 3 }}>
            <MaterialTable state={state} rowStart={rowStart} />
          </Card>
          <PaginationButtons {...rest} />
        </Box>
      </Page>
    </div>
  );
};

export default Index;
