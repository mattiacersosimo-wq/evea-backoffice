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
  Typography,
} from "@mui/material";
import { useState } from "react";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";

import useStair from "./hooks/useStair";

const Referral = () => {
  const { state, handleUpdate, rowStart, onSubmit } = useStair();

  const { data, ...dataProps } = state;

  return (
    <>
      <DataHandlerList dataProps={{ ...dataProps }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Package Name</TableCell>
              <TableCell>Joining Amount</TableCell>
              <TableCell>Percentage (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <Map
              list={data}
              render={(item, i) => (
                <Row
                  key={item.id}
                  {...item}
                  onSubmit={onSubmit}
                  handleUpdate={handleUpdate}
                  {...item}
                  rowStart={i + rowStart}
                />
              )}
            />
          </TableBody>
        </Table>

        <Box textAlign="right">
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton onClick={onSubmit} type="submit" variant="contained">
              {"adminSettings.network.update"}
            </LoadingButton>
          </Stack>
        </Box>
      </DataHandlerList>
    </>
  );
};

const Row = ({ id, amount, name, percentage, handleUpdate, rowStart }) => {
  return (
    <TableRow>
      <TableCell>
        <Typography>{rowStart}</Typography>
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={name}
          name="name"
          type="text"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={amount}
          name="amount"
          type="number"
        />
      </TableCell>

      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={percentage}
          name="percentage"
          type="number"
        />
      </TableCell>
    </TableRow>
  );
};

const LoadingTextField = ({ value, name, handleUpdate, type }) => {
  const [loading, setLoading] = useState(false);
  const onChange = (e) => {
    setLoading(true);
    handleUpdate(e);
  };

  return (
    <TextField
      onWheel={(e) => e.target.blur()}
      type={type}
      onChange={onChange}
      size="small"
      value={value}
      name={name}
    />
  );
};

export default Referral;
