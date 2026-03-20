import { LoadingButton } from "@mui/lab";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { BodyRow } from "src/components/custom-table";
import DataHandlerList from "src/components/data-handler/list";
import EmptyTable from "src/components/emptyTable";
import Map from "src/components/map";

import useReferral from "./hooks/useReferral";
import Translate from "src/components/translate";

const Referral = () => {
  const { state, handleUpdate, onSubmit } = useReferral();

  const { data, ...dataProps } = state;

  return (
    <>
      <DataHandlerList dataProps={{ ...dataProps }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Translate> {"settings.network.rank"}</Translate>
              </TableCell>
              <TableCell>
                {" "}
                <Translate> {"settings.network.referral_bonus"}</Translate>
                (%){" "}
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

        <Box textAlign="right">
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton onClick={onSubmit} type="submit" variant="contained">
              <Translate>{"settings.network.update"}</Translate>
            </LoadingButton>
          </Stack>
        </Box>
      </DataHandlerList>
    </>
  );
};

const Row = ({ id, rank_name, referral_bonus, handleUpdate }) => {
  return (
    <TableRow>
      <TableCell>
        <TextField type="text" size="small" value={rank_name} disabled />{" "}
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={referral_bonus}
          name="referral_bonus"
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

export default Referral;
