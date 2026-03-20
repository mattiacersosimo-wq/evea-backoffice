import { Card, Divider, TableCell, TableRow } from "@mui/material";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import { Currency } from "src/components/with-prefix";
import DataFilter from "./filter";
import useFilter from "../../reports/hooks/use-filter";
import useFetchPendingRanks from "../hooks/useFetchPendingRank";

const headers = [
  "pendingranks.table.no",
  "pendingranks.table.user_name",
  "pendingranks.table.rankname",
  "pendingranks.table.pqv",
  "pendingranks.table.tv",
  "pendingranks.table.gv",
];

const DataTable = () => {
  const methods = useFilter();
  const filter = methods.watch();
  const { state, fetchData, rowStart, ...rest } = useFetchPendingRanks(filter);
  const { data, ...dataProps } = state;

  const onFilter = methods.handleSubmit(async (inputData) => {
    await fetchData(1, inputData);
  });
  return (
    <>
      <Card>
        <DataFilter methods={methods} onFilter={onFilter} isWallet="ewallet" />
        <Scrollbar>
          <DataHandlerTable
            name="faq-table"
            headers={headers}
            dataProps={dataProps}
          >
            <Map
              list={data}
              render={(item, i) => (
                <>
                  <TableRow key={item.id}>
                    <TableCell>{i + rowStart}</TableCell>
                    <TableCell>{item.user?.username}</TableCell>
                    <TableCell>{item.updated_rank?.rank_name}</TableCell>
                    <TableCell>{item.points?.pqv}</TableCell>
                    <TableCell>{item.points?.tv}</TableCell>
                    <TableCell>{item.points?.gv}</TableCell>
                  </TableRow>
                </>
              )}
            />
          </DataHandlerTable>
        </Scrollbar>
        <Divider />
      </Card>
      <PaginationButtons {...rest} />
    </>
  );
};

export default DataTable;
