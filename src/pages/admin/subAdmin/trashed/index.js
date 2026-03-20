import { Card } from "@mui/material";
import React from "react";
import DataHandlerList from "src/components/data-handler/list";
import PaginationButtons from "src/components/pagination";
import Ternary from "src/components/ternary";
import useSubAdminsPagination from "src/pages/admin/subAdmin/hooks/useSubAdminsPagination.js";
import DataTable from "src/pages/admin/subAdmin/trashed/datatable.js";
import useSubAdmins from "../hooks/useGetSubAdmins";

const Index = () => {
  const { state, rowStart, fetchData, ...rest } = useSubAdmins("trashed");
  const { data, ...dataProps } = state;

  return (
    <>
      <Card sx={{ p: 2 }}>
        <DataHandlerList dataProps={{ ...dataProps }}>
          <DataTable rowStart={rowStart} data={data} fetchData={fetchData} />
        </DataHandlerList>
      </Card>
      <Ternary
        when={!dataProps.isArrayEmpty}
        then={<PaginationButtons {...rest} />}
      />
    </>
  );
};

export default Index;
