import { Card, TableCell, TableRow } from "@mui/material";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import { Currency } from "src/components/with-prefix";

const headers = [
  "financial.e_wallet.table.no",
  "financial.e_wallet.table.from",
  "financial.e_wallet.table.amount_type",
  "financial.e_wallet.table.payment_type",
  "financial.e_wallet.table.amount",
  "financial.e_wallet.table.date",
];

const DataList = ({ state, rowStart, ...rest }) => {
  const { data, ...dataProps } = state;

  return (
    <>
      <Card sx={{ pt: 1 }}>
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
                    <TableCell>{item.from_user?.username}</TableCell>
                    <TableCell>
                      {item.payment_type === "Go Mvp Bonus"
                        ? "Go MVP Bonus"
                        : item.payment_type === "Rock Solid Mvp Bonus"
                        ? "Rock Solid MVP Bonus"
                        : item.payment_type === "Rock Solid Mvp Additional Bonus"
                        ? "Rock Solid MVP Additional Bonus"
                        : item.payment_type === "Pmb Bonus"
                        ? "MVP Mentor Bonus"
                        : item.payment_type}
                    </TableCell>{" "}
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {item.type}
                    </TableCell>
                    <TableCell>
                      <Currency>{item.payable_amount}</Currency>
                    </TableCell>
                    <TableCell>
                      <ParseDate date={item?.created_at} />
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
