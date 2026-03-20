import {
  Table as MuiTable,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Scrollbar from "src/components/Scrollbar";
import { useTranslation } from "react-i18next";
import Map from "../map";

const Table = ({ body, headings }) => {
  const { t } = useTranslation();
  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 500 }}>
        <MuiTable>
          <TableHead
            sx={{
              borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
              "& th": { backgroundColor: "transparent" },
            }}
          >
            <TableRow>
              <TableCell width={40}>#</TableCell>
              <Map
                list={headings}
                render={(heading) => (
                  <TableCell align="left">{t(heading)}</TableCell>
                )}
              />
            </TableRow>
          </TableHead>
          {body}
        </MuiTable>
      </TableContainer>
    </Scrollbar>
  );
};

export default Table;
