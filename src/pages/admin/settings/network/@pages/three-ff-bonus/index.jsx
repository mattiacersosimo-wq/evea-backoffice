import { LoadingButton } from "@mui/lab";
import {
  Box,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import { BodyRow } from "src/components/custom-table";
import DataHandlerList from "src/components/data-handler/list";
import EmptyTable from "src/components/emptyTable";
import Map from "src/components/map";
import useErrors from "src/hooks/useErrors";

import axiosInstance from "src/utils/axios";
import useGetData from "./hooks/useGetData";
import Translate from "src/components/translate";

const ThreeForFree = () => {
  const { state, handleUpdate, onSubmit } = useGetData();
  const { data, ...dataProps } = state;
  return (
    <Scrollbar>
      <DataHandlerList dataProps={{ ...dataProps }}>
        {/* <TableContainer sx={{ maxWidth: 500 }}> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Translate>settings.network.personal_order_qv</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.required_customers</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.customer_min_qv</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.max_bonus_value</Translate>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <Map
              list={data}
              render={(item) => (
                <Row
                  key={item.id}
                  {...item}
                  onSubmit={onSubmit}
                  handleUpdate={handleUpdate}
                  {...item}
                />
              )}
            />
          </TableBody>
        </Table>
        {/* </TableContainer> */}
        <Box textAlign="right">
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton onClick={onSubmit} type="submit" variant="contained">
              <Translate>{"settings.network.update"}</Translate>
            </LoadingButton>
          </Stack>
        </Box>
      </DataHandlerList>
    </Scrollbar>
  );
};

const Row = ({
  id,
  personal_order_qv,
  customer_min_qv,
  required_customers,
  max_bonus_value,
  handleUpdate,
}) => {
  return (
    <TableRow>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          size="small"
          value={personal_order_qv}
          name="personal_order_qv"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={required_customers}
          name="required_customers"
          size="small"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={customer_min_qv}
          name="customer_min_qv"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={max_bonus_value}
          name="max_bonus_value"
        />
      </TableCell>
    </TableRow>
  );
};

const LoadingTextField = ({ value, name, handleUpdate }) => {
  const [loading, setLoading] = useState(false);
  const onChange = (e) => {
    setLoading(true);
    handleUpdate(e);
  };

  return (
    <TextField
      onWheel={(e) => e.target.blur()}
      type="number"
      onChange={onChange}
      size="small"
      value={value}
      name={name}
    />
  );
};

export default ThreeForFree;
