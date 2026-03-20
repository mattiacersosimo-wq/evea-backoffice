import { Card, TableCell, TableRow } from "@mui/material";
import { capitalCase } from "change-case";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import { Currency } from "src/components/with-prefix";

const headers = [
  "financial.fund_transfer.table.no",
  "financial.fund_transfer.table.to_user",
  "financial.fund_transfer.table.payment_type",
  "financial.fund_transfer.table.wallet_type",
  "financial.fund_transfer.table.amount",
  "financial.fund_transfer.table.date",
  "global.note",
  // "financial.fund_transfer.table.payment_status",
];

const DataList = ({ state, rowStart, ...rest }) => {
  const { data, ...dataProps } = state;

  return (
    <>
      <Card sx={{ mt: 2, pt:1 }}>
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
                  <TableRow>
                    <TableCell>{i + rowStart}</TableCell>
                    <TableCell>{item?.from_user?.username}</TableCell>
                    <TableCell>{capitalCase(item.type)}</TableCell>
                    <TableCell>{capitalCase(item.wallet_type)}</TableCell>
                    <TableCell>
                      <Currency>{item.total_amount}</Currency>
                    </TableCell>
                    <TableCell>
                      <ParseDate date={item.created_at} />
                    </TableCell>
                    <TableCell>{item.note}</TableCell>
                    {/* <TableCell>{item.payment_status}</TableCell> */}
                  </TableRow>
                </>
              )}
            />
          </DataHandlerTable>
        </Scrollbar>
      </Card>

      <PaginationButtons {...rest} />
    </>
  );
};

export default DataList;
