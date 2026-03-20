import { Button, Grid } from "@mui/material";
import { lowerCase } from "lodash";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";
import Iconify from "src/components/Iconify";
import useAuth from "src/hooks/useAuth";

import { PATH_USER } from "src/routes/paths";
import Summary from "../summary";
import BitTabs from "./components/bitTabs";
import DepositWallet, { ErrorDialog } from "./components/depositWallet";
import FinPay from "./components/finPay";
import Methods from "./methods";
import purchase, { TYPES } from "./utils/purchase";

const openDialog = createContext(null);

export const useOpenDialog = () => useContext(openDialog);

const Payment = ({ goBack }) => {
  const navigate = useNavigate();
  const [havePaymentMethods, setHavePaymentMethods] = useState(false);
  const [dialogName, setOpenDialog] = useState("");
  const [paymentData, setPaymentData] = useState({
    message: "",
    qrCode: "",
    amount_btc: "",
    payment_address: "",
    payment_id: "",
  });
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const { resetCart } = useAuth();
  const completeOrder = async () => {
    const isFinPay =
      lowerCase(selectedPaymentType.replace(" ", "")) === TYPES.finPay;
    const isDepositWallet =
      selectedPaymentType.replace(" ", "").toLowerCase() === TYPES.wallet;
    if (isFinPay) {
      setOpenDialog(TYPES.finPay);
    } else {
      const { status, ...rest } = await purchase(selectedPaymentType);
      resetCart();
      if (status) {
        if (isDepositWallet) {
          navigate(PATH_USER.my_orders.view(rest.invoiceId));
        } else {
          setOpenDialog(selectedPaymentType.toLowerCase().replace(" ", ""));
          setPaymentData(rest);
        }
      } else {
        setOpenDialog("error");
        setPaymentData(rest);
      }
    }
  };

  return (
    <>
      <openDialog.Provider value={{ value: dialogName }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Methods
              setSelectedPaymentType={setSelectedPaymentType}
              setHavePaymentMethods={setHavePaymentMethods}
            />
            <Button
              size="small"
              color="inherit"
              onClick={goBack}
              startIcon={<Iconify icon={"eva:arrow-ios-back-fill"} />}
              name="back"
            >
              {"userOnlineStore.back"}
            </Button>
          </Grid>

          <Grid item xs={12} md={4}>
            <Summary />
            <Button
              disabled={!havePaymentMethods}
              onClick={() => completeOrder()}
              fullWidth
              size="large"
              variant="contained"
              name="order"
            >
              {"userOnlineStore.completeOrder"}
            </Button>
          </Grid>
        </Grid>

        <BitTabs paymentData={paymentData} name="bitcoin" />
        <BitTabs paymentData={paymentData} name="coinpayments" />
        <DepositWallet message={paymentData.message} />
        <ErrorDialog message={paymentData.message} />
        <FinPay onClose={() => setOpenDialog("")} />
      </openDialog.Provider>
    </>
  );
};

export default Payment;
