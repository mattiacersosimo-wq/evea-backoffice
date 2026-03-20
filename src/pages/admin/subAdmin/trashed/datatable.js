import { TableCell, TableContainer, TableRow } from "@mui/material";

import Scrollbar from "src/components/Scrollbar";
import ParseDate from "src/components/date";
import Loop from "src/components/loop";
import Ternary from "src/components/ternary";
import TimeOutTable from "src/components/timout-table";

const headers = [
  "sub_admin.no",
  "sub_admin.name",
  "sub_admin.userName",
  "sub_admin.email",
  "sub_admin.user_group",
  "sub_admin.reasons",
  "sub_admin.createdAt",
  "sub_admin.delete_at",
];

const DataTable = ({ data, rowStart, timeout }) => {
  return (
    <div>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <TimeOutTable
            headers={headers}
            isTimedOut={timeout}
            length={data.length}
          >
            <Ternary
              when={Boolean(data.length)}
              then={
                <Loop
                  list={data}
                  render={(row, i) => (
                    <TableRow key={row.id}>
                      <TableCell>{i + rowStart}</TableCell>
                      <TableCell>
                        {row.user?.user_profile?.first_name}
                      </TableCell>
                      <TableCell>{row.user.username}</TableCell>
                      <TableCell>{row.user.email}</TableCell>
                      <TableCell>{row.user_group.name}</TableCell>
                      <TableCell>{row.reason}</TableCell>
                      <TableCell>
                        <ParseDate date={row.created_at} />
                      </TableCell>
                      <TableCell>
                        <ParseDate date={row.deleted_at} />
                      </TableCell>
                    </TableRow>
                  )}
                />
              }
            />
          </TimeOutTable>
        </TableContainer>
      </Scrollbar>
    </div>
  );
};

export default DataTable;
