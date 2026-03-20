import { Card } from "@mui/material";
import DataHandlerList from "src/components/data-handler/list";
import PaginationButtons from "src/components/pagination";
import Ternary from "src/components/ternary";
import useSubAdmins from "../hooks/useGetSubAdmins";
import DataTable from "./datatable";

const Index = () => {
  const { state, rowStart, fetchData, ...rest } = useSubAdmins("active");
  const { data, ...dataProps } = state;

  return (
    <>
      <Card>
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
