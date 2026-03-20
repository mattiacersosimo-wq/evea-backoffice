import { Card, TableCell, TableRow } from "@mui/material";
import { capitalCase } from "change-case";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import { Currency } from "src/components/with-prefix";
import useHistory from "./hooks/use-history";
import useFilter from "./hooks/use-filter";
import DataFilter from "./components/dataFilter";

const DataTable = ({ state, fetchData, rowStart, ...rest }) => {
  const { data, ...dataProps } = state;
  const headers = [
    "financial.fund_credit.table.no",
    "financial.fund_credit.table.user",
    "financial.fund_credit.table.amount",
    "financial.fund_credit.table.payment_type",
    "financial.fund_credit.table.wallet_type",
    "financial.fund_credit.table.notes",
    "financial.fund_credit.table.date",
  ];

  return (
    <div>
      <Card sx={{ mt: 2 }}>
        <Scrollbar>
          <DataHandlerTable
            name="faq-table"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(item, i) => (
                <>
                  <TableRow key={item.id}>
                    <TableCell>{rowStart + i}</TableCell>
                    <TableCell>{item?.user?.username}</TableCell>
                    <TableCell>
                      <Currency>{item.total_amount}</Currency>
                    </TableCell>
                    <TableCell>{capitalCase(item.type)}</TableCell>
                    <TableCell> {capitalCase(item.wallet_type)}</TableCell>
                    <TableCell>{item.note}</TableCell>
                    <TableCell>
                      <ParseDate date={item.created_at} />
                    </TableCell>
                  </TableRow>
                </>
              )}
            />
          </DataHandlerTable>
        </Scrollbar>
      </Card>
      <PaginationButtons {...rest} />
    </div>
  );
};

export default DataTable;
