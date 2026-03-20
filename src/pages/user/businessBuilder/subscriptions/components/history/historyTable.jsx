import { Box, IconButton, TableCell, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import { Currency } from "src/components/with-prefix";
import { PATH_USER } from "src/routes/paths";

const headers = [
  "business_builder.subscriptions.table.no",
  "business_builder.subscriptions.table.amount",
  "business_builder.subscriptions.table.date",
  "business_builder.subscriptions.table.effective",
  "business_builder.subscriptions.table.method",
  "business_builder.subscriptions.table.view",
];

const HistoryTable = ({ history, rowStart }) => {
  const { data, ...dataProps } = history;

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Scrollbar>
          <DataHandlerTable
            name="category-table"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(row, i) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center" component="th" scope="row">
                    {i + rowStart}
                  </TableCell>
                  <TableCell align="right">
                    <Currency>{row.amount}</Currency>
                  </TableCell>
                  <TableCell align="right">
                    <ParseDate date={row.invoice_date} />
                  </TableCell>
                  <TableCell align="right">
                    <ParseDate date={row.effective_until} />
                  </TableCell>
                  <TableCell align="center">
                    {row.payment_method ? row.payment_method : "--"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      component={Link}
                      to={PATH_USER.business_builder.invoice(row.id)}
                      name="view"
                    >
                      <Iconify icon="carbon:view" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )}
            />
          </DataHandlerTable>
        </Scrollbar>
      </Box>
    </>
  );
};

export default HistoryTable;
