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
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import useCountDown from "src/hooks/use-count-down";

import CloseDialog from "src/pages/user/onlineStore/checkout/components/payment/components/closeDialog";
import { PATH_USER } from "src/routes/paths";
import AddressField from "./components/addressField";
import useCheckSuccess from "./hooks/useChekSuccess";
import Transition from "src/utils/dialog-animation";
import Translate from "src/components/translate";

const useCountDowner = (timeout) => {
  const { t } = useTranslation();
  const format = "YYYY-MM-DD HH:mm:ss";

  const expiryDate = useMemo(
    () => Date.parse(moment().add(timeout, "seconds").format(format)),
    [timeout]
  );
  const { days, hours, minutes, seconds } = useCountDown(expiryDate);

  return t("coupons.crypto.expires_in", { days, hours, minutes, seconds });
};

export const ScannerDialog = ({ open, paymentData, onClose, onSuccess }) => {
  const { t } = useTranslation();
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
            {t("coupons.crypto.enough_fee_hint")}
          </Typography>
          <Typography variant="caption">{expiresInTimer}</Typography>
          <Typography></Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="body1">{t("coupons.crypto.what_next_title")}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                {t("coupons.crypto.step1_prefix")}{" "}
                <strong>
                  {amount_btc} {coin_type}
                </strong>{" "}
                {t("coupons.crypto.step1_address_prefix")} <strong>{payment_address}</strong>. {t("coupons.crypto.step1_suffix")}
              </Typography>
              <Typography variant="body2" paragraph>
                {t("coupons.crypto.step2")}
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
                {t("coupons.crypto.not_enough_title")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                {t("coupons.crypto.not_enough_body")}
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
