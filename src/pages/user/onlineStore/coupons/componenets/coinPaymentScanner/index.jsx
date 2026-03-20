import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Collapse,
  Dialog,
  DialogContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import useCountDown from "src/hooks/use-count-down";

import CloseDialog from "src/pages/user/onlineStore/checkout/components/payment/components/closeDialog";
import { PATH_USER } from "src/routes/paths";
import AddressField from "./components/addressField";
import useCheckSuccess from "./hooks/useChekSuccess";
import Transition from "src/utils/dialog-animation";
import Translate from "src/components/translate";

const useCountDowner = (timeout) => {
  const format = "YYYY-MM-DD HH:mm:ss";

  const expiryDate = useMemo(
    () => Date.parse(moment().add(timeout, "seconds").format(format)),
    [timeout]
  );
  const { days, hours, minutes, seconds } = useCountDown(expiryDate);

  return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
};

export const ScannerDialog = ({ open, paymentData, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const {
    payment_address,
    amount_btc,
    qrCode,
    payment_id,
    coin_type,
    timeout,
  } = paymentData;
  useCheckSuccess(open, payment_id, (invoiceId) => {
    if (onSuccess) {
      onSuccess(invoiceId);
    } else {
      navigate(PATH_USER.my_orders.view(invoiceId));
    }
  });

  const expiresInTimer = useCountDowner(timeout);

  return (
    <Dialog
      TransitionComponent={Transition}
      fullWidth
      maxWidth="xs"
      open={open}
    >
      <DialogContent>
        <CloseDialog onClose={onClose} />

        <Stack justifyContent="center" alignItems="center" spacing={2}>
          <Box
            sx={{
              textAlign: "center",
              color: "#4c5054",
            }}
          >
            <Typography variant="h6">
              <Translate> {"global.scanThisCode"}</Translate>{" "}
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
            <Typography variant="body2">{coin_type}</Typography>
            <Typography variant="h4">{amount_btc}</Typography>
          </Stack>
          <AddressField payment_address={payment_address} />
          <Typography>
            {/* Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. */}
            Make sure to send enough to cover any coin transaction fees!
          </Typography>
          <Typography variant="caption">{expiresInTimer}</Typography>
          <Typography></Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="body1">What to do next?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                1) Please send{" "}
                <strong>
                  {amount_btc} {coin_type}
                </strong>{" "}
                to address <strong>{payment_address}</strong>. (Make sure to
                send enough to cover any coin transaction fees!) You will need
                to initiate the payment using your software or online wallet and
                copy/paste the address and payment amount into it. We will email
                you when all funds have been received
              </Typography>
              <Typography variant="body2" paragraph>
                2) After sending payment, review the status of your transaction
                on this page. Once the payment is confirmed several times in the
                block chain, the payment will be completed and the merchant will
                be notified. The confirmation process usually takes 10-45
                minutes but varies based on the coin's target block time and
                number of block confirms required.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="body1">
                What if I accidentally don't send enough?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                If you don't send enough, that is OK. Just send the remainder
                and we will combine them for you. You can also send from
                multiple wallets/accounts.
              </Typography>
            </AccordionDetails>
          </Accordion>
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
          <Translate>{"global.transactionsCan"}</Translate>
        </Typography>
      </Box>
    </Dialog>
  );
};
