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

const RspBonusSettings = () => {
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
                <Translate>settings.network.required_dqv</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.required_customers</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.required_personal_volume</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.min_customer_qv</Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.monthly_bonus_amount</Translate>
              </TableCell>
              <TableCell>
                <Translate>
                  settings.network.consecutive_months_bonus_trigger
                </Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.consecutive_bonus_amount</Translate>
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
  required_dqv,
  required_customers,
  min_customer_qv,
  monthly_bonus_amount,
  consecutive_months_bonus_trigger,
  consecutive_bonus_amount,
  required_personal_volume,
  handleUpdate,
}) => {
  return (
    <TableRow>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={required_dqv}
          name="required_dqv"
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
          value={Number(required_personal_volume)}
          name="required_personal_volume"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={min_customer_qv}
          name="min_customer_qv"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={monthly_bonus_amount}
          name="monthly_bonus_amount"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={consecutive_months_bonus_trigger}
          name="consecutive_months_bonus_trigger"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={consecutive_bonus_amount}
          name="consecutive_bonus_amount"
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

export default RspBonusSettings;
