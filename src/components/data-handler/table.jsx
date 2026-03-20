import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import EmptyTable from "../emptyTable";
import Loop from "../loop";
import Ternary from "../ternary";
import Translate from "../translate";

const DataHandlerTable = ({
  dataProps,
  headers = [],
  children,
  tableProps = {},
  forceEmpty,
  name,
  sx = {},
}) => {
  const { loading, error, isArrayEmpty } = dataProps;

  return (
    <TableContainer component={Paper} sx={sx}>
      <Table {...tableProps} name={name} stickyHeader>
        <TableHead>
          <TableRow>
            <Loop
              list={headers}
              render={(item) => (
                <TableCell>
                  <Translate>{item}</Translate>
                </TableCell>
              )}
            />
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
      <Ternary
        when={loading}
        then={
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: 3,
              marginBottom: 3,
            }}
          >
            <CircularProgress />
          </Box>
        }
        otherwise={
          <Ternary
            when={isArrayEmpty || forceEmpty}
            then={<EmptyTable error={error} />}
          />
        }
      />
    </TableContainer>
  );
};

export default DataHandlerTable;
