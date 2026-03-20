import { Card } from "@mui/material";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import Ternary from "src/components/ternary";
import useFetchIncome from "../hooks/useFetchIncome";
import Filter from "./filter";
import DataList from "./row";

const headers = [
  "user.income_report.table.no",
  "user.income_report.table.from",
  "user.income_report.table.amount_type",
  "user.income_report.table.credit",
  "user.income_report.table.created",
];

const DataTable = () => {
  const {
    state,
    data: dataList,
    fetchData,
    rowStart,
    setFilter,
    ...rest
  } = useFetchIncome();
  const { data, ...dataProps } = state;

  return (
    <>
      <Card sx={{ mt: 2, p: 2 }}>
        <Filter
          onFilter={(filter) => {
            fetchData(rest.page, filter);
          }}
        />
        <Scrollbar>
          <DataHandlerTable
            name="income-table"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(income, i) => (
                <DataList income={income} rowNumber={rowStart + i} />
              )}
            />
          </DataHandlerTable>
        </Scrollbar>
      </Card>
      <Ternary
        when={!dataProps.isArrayEmpty}
        then={<PaginationButtons {...rest} />}
      />
    </>
  );
};

export default DataTable;
