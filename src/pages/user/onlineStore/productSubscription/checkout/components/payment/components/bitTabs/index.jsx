import {
  Box,
  Dialog,
  DialogContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "src/hooks/useAuth";

import { PATH_USER } from "src/routes/paths";
import { useOpenDialog } from "../..";
import checkSuccess from "../../utils/checkSuccess";
import CloseDialog from "../closeDialog";
import AddressField from "./addressField";
import Translate from "src/components/translate";

const BitTabs = ({ paymentData, name }) => {
  const { value } = useOpenDialog();
  const isOpen = value.toLowerCase().replace(" ", "") === name;
  const navigate = useNavigate();
  const {
    user: { id },
  } = useAuth();
  const { payment_id, payment_address, amount_btc, qrCode } = paymentData;
  useEffect(() => {
    const check = async () => {
      const { status, invoiceId } = await checkSuccess(payment_id, id);
      const success = status === "finished";
      if (success) {
        navigate(PATH_USER.my_orders.view(invoiceId));
      }
    };
    if (payment_id && isOpen) {
      const interval = setInterval(check, 5000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [payment_id, isOpen]);

  return (
    <Dialog fullWidth maxWidth="xs" open={isOpen}>
      <DialogContent>
        <CloseDialog />

        <Stack justifyContent="center" alignItems="center" spacing={2}>
          <Box
            sx={{
              textAlign: "center",
              color: "#4c5054",
            }}
          >
            <Typography variant="h6">
              <Translate> {"global.scanThisCode"}</Translate>
            </Typography>
            <img
              style={{
                minWidth: "246px",
                minHeight: "246px",
              }}
              src={qrCode}
            />
          </Box>
          <Stack alignItems="center">
            <Typography variant="body2">BTC</Typography>
            <Typography variant="h4">{amount_btc}</Typography>
          </Stack>
          <AddressField payment_address={payment_address} />
          <Typography variant="body2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Typography>
        </Stack>
      </DialogContent>
      <LinearProgress color="primary" />

      <Box
        sx={{
          padding: "1rem 2rem",
          backgroundColor: "primary.main",
          color: "#fff",
        }}
      >
        <Typography>
          {" "}
          <Translate>{"global.transactionsCan"}</Translate>
        </Typography>
      </Box>
    </Dialog>
  );
};

export default BitTabs;
