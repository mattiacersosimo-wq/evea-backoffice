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

const Stripe = ({ recurringCheckbox = false, name }) => {
  const { watch, setValue } = useFormContext();

  const isStripe = watch(name) === TYPES.stripe;

  return (
    <Collapse in={isStripe}>
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
                    checked={Boolean(watch("stripe_recurring"))}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setValue("stripe_recurring", checked ? 1 : 0);
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

export default Stripe;
