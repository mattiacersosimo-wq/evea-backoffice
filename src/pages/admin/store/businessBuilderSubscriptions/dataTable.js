import { Box, TableCell, TableRow } from "@mui/material";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";

const headers = [
  "businessBuilder.no",
  "businessBuilder.userName",
  "businessBuilder.email",
  "businessBuilder.amount",
  "businessBuilder.date",
  "businessBuilder.effectiveUntil",
];

const DataTable = ({ tableData, rowStart }) => {
  const { data, ...dataProps } = tableData;
  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Scrollbar>
          <DataHandlerTable
            name="faq-table"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(item, i) => (
                <TableRow key={i}>
                  <TableCell>{i + rowStart}</TableCell>
                  <TableCell>{item.user.username}</TableCell>
                  <TableCell>{item.user.email}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>
                    <ParseDate date={item.created_at} />
                  </TableCell>
                  <TableCell>
                    <ParseDate date={item.effective_until} />
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

export default DataTable;
