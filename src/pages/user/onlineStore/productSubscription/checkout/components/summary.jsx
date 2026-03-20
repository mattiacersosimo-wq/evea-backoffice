import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { Currency } from "src/components/with-prefix";

import { fCurrency } from "src/utils/formatNumber";
import { usePurchaseData } from "../store/purchaseStore";

const Summary = ({ enableDiscount = false }) => {
  const { total_amount: total } = usePurchaseData() || {};

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title={"orderSummary"} />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {"userOnlineStore.subTotal"}
            </Typography>
            <Typography variant="subtitle2">
              <Currency>{total}</Currency>
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {"userOnlineStore.discount"}
            </Typography>
            <Typography variant="subtitle2">-</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {"userOnlineStore.shipping"}
            </Typography>
            <Typography variant="subtitle2">
              {"userOnlineStore.free"}
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">
              {"userOnlineStore.total"}
            </Typography>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="subtitle1" sx={{ color: "error.main" }}>
                <Currency>{total}</Currency>
              </Typography>
            </Box>
          </Stack>

          {enableDiscount && (
            <TextField
              fullWidth
              placeholder="Discount codes / Gifts"
              value="DISCOUNT5"
              disabled
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button sx={{ mr: -0.5 }} disabled name="apply">
                      {"userOnlineStore.apply"}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

Summary.propTypes = {
  total: PropTypes.number,
  discount: PropTypes.number,
  subtotal: PropTypes.number,
  shipping: PropTypes.number,
  onEdit: PropTypes.func,
  enableEdit: PropTypes.bool,
  enableDiscount: PropTypes.bool,
};

export default Summary;
