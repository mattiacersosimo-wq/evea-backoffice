import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import Ternary from "src/components/ternary";
import TYPES from "src/utils/types";

const Paypal = ({ name, recurringCheckbox = false }) => {
  const { watch, setValue } = useFormContext();
  const paymentCode = watch(name);
  const isPaypal =
    paymentCode === TYPES.paypal || paymentCode === TYPES.paypalBTaf;

  return (
    <Collapse in={isPaypal}>
      <Box sx={{ mb: 2.5 }}>
        <Ternary
          when={recurringCheckbox}
          then={
            <>
              <FormControlLabel
                sx={{
                  mt: 2,
                }}
                control={
                  <Checkbox
                    checked={Boolean(watch("paypal_recurring"))}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setValue("paypal_recurring", checked ? 1 : 0);
                    }}
                    name=""
                  />
                }
                label={
                  <Typography color="primary" variant="caption">
                    This Product has recurring enabled.Untick to disable it.
                  </Typography>
                }
              />
              <br />
            </>
          }
        />

        {/* <Typography variant="caption">{finPayMessage}</Typography> */}
      </Box>
    </Collapse>
  );
};

export default Paypal;
