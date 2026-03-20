import { Card, TableCell, TableRow } from "@mui/material";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import { Currency } from "src/components/with-prefix";

const headers = [
  "financial.deposit_wallet.table.no",
  "financial.deposit_wallet.table.user",
  "financial.deposit_wallet.table.amount_type",
  "financial.deposit_wallet.table.payment_type",
  "financial.deposit_wallet.table.amount",
  "financial.deposit_wallet.table.date",
];

const DataList = ({ state, rowStart, ...rest }) => {
  const { data, ...dataProps } = state;

  return (
    <>
      <Card sx={{ pt: 1, mt:2 }}>
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
                    <TableCell>{i + rowStart}</TableCell>
                    <TableCell>{item.from_user.username}</TableCell>
                    <TableCell>{item.payment_type}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {item.type}
                    </TableCell>
                    <TableCell>
                      <Currency>{item.total_amount}</Currency>
                    </TableCell>
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
    </>
  );
};

export default DataList;
