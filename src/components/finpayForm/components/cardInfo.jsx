import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { RHFTextField } from "src/components/hook-form";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

const CardInfo = ({ recurringCheckbox = false }) => {
  const { setValue, watch } = useFormContext();
  return (
    <Box mt={2}>
      <Typography gutterBottom variant="subtitle2">
        <Translate>fin_pay.card_details</Translate>
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(2, 1fr)", sm: "repeat(1, 1fr)" },
          gap: 2,
          gridTemplateRows: "auto",
        }}
      >
        <Box>
          <RHFTextField
            label="fin_pay.holder_name"
            name="payment_cardname"
            size="small"
          />
        </Box>
        <Box>
          <RHFTextField
            size="small"
            label="fin_pay.number"
            name="payment_cardnumber"
          />
        </Box>

        <Box>
          <RHFTextField
            size="small"
            label="fin_pay.expiry"
            name="payment_cardexpiry"
            placeholder="MMYY"
          />
        </Box>
        <Box>
          <RHFTextField
            size="small"
            label="fin_pay.cvv"
            name="paymentcard_csc"
          />
        </Box>
      </Box>

      <Ternary
        when={recurringCheckbox}
        then={
          <FormControlLabel
            sx={{
              mt: 2,
            }}
            control={
              <Checkbox
                checked={Boolean(watch("is_finpay_recurring"))}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setValue("is_finpay_recurring", checked ? 1 : 0);
                }}
                name=""
              />
            }
            label={
              <Typography color="primary" variant="caption">
                <Translate>fin_pay.product_recurring_enabled</Translate>
              </Typography>
            }
          />
        }
      />
    </Box>
  );
};

export default CardInfo;
