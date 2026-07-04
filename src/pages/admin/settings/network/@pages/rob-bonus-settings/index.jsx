import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import useGetData from "./hooks/useGetData";
import Translate from "src/components/translate";

const RobBonus = () => {
  const { state, handleUpdate, onSubmit } = useGetData();
  const { data, ...dataProps } = state;
  return (
    <Scrollbar>
      <DataHandlerList dataProps={{ ...dataProps }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Translate>settings.network.discount_percentage</Translate>
              </TableCell>
              <TableCell>
                <Translate>
                  settings.network.required_consecutive_months
                </Translate>
              </TableCell>
              <TableCell>
                <Translate>
                  settings.network.min_qv
                </Translate>
              </TableCell>
              <TableCell>
                <Translate>settings.network.bonus_coupon_value</Translate>
                (fisso)
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

        {/* ROB Proporzionale (variante G) — sezione dedicata */}
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            ROB Proporzionale (formula)
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Formula: <code>coupon = min(cap, max(floor, coefficient × subtotale_minimo_del_ciclo))</code>.
            Con lo switch OFF il coupon torna al valore fisso configurato sopra (fallback sicuro).
          </Typography>
          <Map
            list={data}
            render={(item) => (
              <ProportionalRow
                key={`prop-${item.id}`}
                {...item}
                handleUpdate={handleUpdate}
              />
            )}
          />
        </Box>

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
  discount_percentage,
  bonus_coupon_value,
  required_consecutive_months,
  min_qv,
  handleUpdate,
}) => {
  return (
    <TableRow>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          size="small"
          value={discount_percentage}
          name="discount_percentage"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={required_consecutive_months}
          name="required_consecutive_months"
          size="small"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={min_qv}
          name="min_qv"
          size="small"
        />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={bonus_coupon_value}
          name="bonus_coupon_value"
        />
      </TableCell>
    </TableRow>
  );
};

const ProportionalRow = ({
  id,
  formula_coefficient,
  formula_cap,
  formula_floor,
  use_proportional_formula,
  handleUpdate,
}) => {
  const isOn = Boolean(Number(use_proportional_formula));
  const onSwitchChange = (e) => {
    handleUpdate(id)({
      target: { name: "use_proportional_formula", value: e.target.checked ? 1 : 0 },
    });
  };
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <FormControlLabel
          control={
            <Switch checked={isOn} onChange={onSwitchChange} color="primary" />
          }
          label={
            <Typography variant="body2">
              Usa formula proporzionale ({isOn ? "ATTIVA" : "OFF - fallback fisso"})
            </Typography>
          }
        />
        <TextField
          label="Coefficient (es. 0.6667 = 2/3)"
          size="small"
          type="number"
          value={formula_coefficient ?? ""}
          name="formula_coefficient"
          onChange={handleUpdate(id)}
          inputProps={{ step: "0.0001", min: 0, max: 2 }}
          sx={{ width: 200 }}
          disabled={!isOn}
        />
        <TextField
          label="Cap (€)"
          size="small"
          type="number"
          value={formula_cap ?? ""}
          name="formula_cap"
          onChange={handleUpdate(id)}
          inputProps={{ step: "0.01", min: 0 }}
          sx={{ width: 140 }}
          disabled={!isOn}
        />
        <TextField
          label="Floor (€)"
          size="small"
          type="number"
          value={formula_floor ?? ""}
          name="formula_floor"
          onChange={handleUpdate(id)}
          inputProps={{ step: "0.01", min: 0 }}
          sx={{ width: 140 }}
          disabled={!isOn}
        />
      </Stack>
      {isOn && (
        <Alert severity="info" sx={{ mt: 1 }}>
          Con questi parametri il coupon sara' calcolato dinamicamente sul subtotale minimo del
          ciclo di {formula_coefficient} x subtotale, con floor {formula_floor}€ e cap {formula_cap}€.
        </Alert>
      )}
    </Box>
  );
};

const LoadingTextField = ({ value, name, handleUpdate }) => {
  const onChange = (e) => {
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

export default RobBonus;
