import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Scrollbar from "src/components/Scrollbar";
import { FormProvider } from "src/components/hook-form";

const Table = ({ children }) => {
  return (
    <Scrollbar>
      <FormProvider>
        <TableContainer sx={{ minWidth: 720 }}>
          <MuiTable>
            <TableHead>
              <TableRow>
                <TableCell>{"adminSettings.network.rank"}</TableCell>
                <TableCell>{"adminSettings.network.referralBonus"}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{children}</TableBody>
          </MuiTable>
        </TableContainer>
      </FormProvider>
    </Scrollbar>
  );
};

export default Table;
