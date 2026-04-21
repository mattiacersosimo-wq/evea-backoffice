import { LoadingButton } from "@mui/lab";
import { Alert, Box, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { useState } from "react";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import useGetData from "./hooks/useGetData";

const FastStartBonus = () => {
  const { state, handleUpdate, onSubmit } = useGetData();
  const { data, ...dataProps } = state;

  return (
    <Scrollbar>
      <Alert severity="info" sx={{ mb: 2 }}>
        Fast Start Bonus: pagato allo sponsor quando un nuovo utente compra uno starter pack.
        L'importo è fisso per kit (Bronze/Silver/Gold) e viene pagato in <b>weekly</b> (auto-approve dopo 15 giorni).
      </Alert>

      <DataHandlerList dataProps={{ ...dataProps }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pack</TableCell>
              <TableCell>Importo bonus (€)</TableCell>
              <TableCell>Attivo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <Map
              list={data}
              render={(item) => (
                <Row
                  key={item.id}
                  {...item}
                  handleUpdate={handleUpdate}
                />
              )}
            />
          </TableBody>
        </Table>

        <Box textAlign="right">
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton onClick={onSubmit} variant="contained">
              Salva
            </LoadingButton>
          </Stack>
        </Box>
      </DataHandlerList>
    </Scrollbar>
  );
};

const Row = ({ id, package_name, amount, active, handleUpdate }) => {
  return (
    <TableRow>
      <TableCell>
        <b>{package_name}</b>
      </TableCell>
      <TableCell>
        <EditableTextField
          value={amount}
          name="amount"
          handleUpdate={handleUpdate(id)}
        />
      </TableCell>
      <TableCell>
        <Switch
          checked={!!parseInt(active)}
          onChange={(e) => handleUpdate(id)({ target: { name: "active", value: e.target.checked ? 1 : 0 } })}
        />
      </TableCell>
    </TableRow>
  );
};

const EditableTextField = ({ value, name, handleUpdate }) => {
  const [loading] = useState(false);
  return (
    <TextField
      onWheel={(e) => e.target.blur()}
      type="number"
      size="small"
      value={value ?? ""}
      name={name}
      onChange={handleUpdate}
      disabled={loading}
      InputProps={{ startAdornment: <Box sx={{ mr: 0.5, color: "#7A6A5C" }}>€</Box> }}
    />
  );
};

export default FastStartBonus;
