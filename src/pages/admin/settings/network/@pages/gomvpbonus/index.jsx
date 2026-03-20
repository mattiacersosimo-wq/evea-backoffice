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

const GoMvpBonus = () => {
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
                <Translate>settings.network.min_dqv</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.required_customers</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.min_qv_per_customer</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.min_pqv</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.qualification_days</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.bonus_amount</Translate>
              </TableCell>
              {/* <TableCell>
                <Translate>settings.network.active</Translate>
              </TableCell> */}
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
  min_dqv,
  required_customers,
  min_qv_per_customer,
  qualification_days,
  bonus_amount,
  min_pqv,
  handleUpdate,
}) => {
  return (
    <TableRow>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          size="small"
          value={min_dqv}
          name="min_dqv"

        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={required_customers}
          name="required_customers"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={min_qv_per_customer}
          name="min_qv_per_customer"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={min_pqv}
          name="min_pqv"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={qualification_days}
          name="qualification_days"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={bonus_amount}
          name="bonus_amount"
        />
      </TableCell>
      {/* <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={active}
          name="active"
        />
      </TableCell> */}
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

export default GoMvpBonus;
