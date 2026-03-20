import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import getBtafPayment from "src/api/user/purchase/btaf-payment";
import Iconify from "src/components/Iconify";
import useQueryParams from "src/hooks/useQueryParams";
import { PATH_USER } from "src/routes/paths";
import fetchUser from "src/utils/fetchUser";
import invoiceAbi from "./utils/abi/invoice";
import tokenAbi from "./utils/abi/token";
import connectChain from "./utils/connect-chain";
import tokenAmountToWeiAmount from "./utils/token-amount-to-wei-amount";
import Transition from "src/utils/dialog-animation";

const TafToken = () => {
  const { queryObject, deleteParam } = useQueryParams();
  const navigate = useNavigate();
  const { token } = queryObject;
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    const { status, ...data } = await getBtafPayment(token);
    if (status) {
      const {
        contract_address,
        token_contract_address,
        total_amount_in_btaf,
        invoice_id,
        user_payment_id,
        v,
        r,
        s,
      } = data;
      const { address, signer } = await connectChain();
      const weiAmount = tokenAmountToWeiAmount(total_amount_in_btaf.toString());

      const tokenContract = new ethers.Contract(
        token_contract_address,
        tokenAbi,
        signer
      );

      try {
        const userAllowance = await tokenContract.allowance(
          address,
          contract_address
        );

        if (userAllowance.lt(weiAmount)) {
          await // We use MaxUint256 because this is the highest value you can use in an approve transaction
          // This reduces the gas cost by a user as often this is the highest value they will ever need
          (
            await tokenContract.approve(
              contract_address,
              ethers.constants.MaxUint256
            )
          ).wait();
        }
      } catch (err) {
        console.log(err);
      }

      // console.log(userAllowance);

      // Invoice
      const invoiceContract = new ethers.Contract(
        contract_address,
        invoiceAbi,
        signer
      );

      try {
        const payInvoiceReceipt = await (
          await invoiceContract.payInvoice(invoice_id, weiAmount, { v, r, s })
        ).wait();
        if (payInvoiceReceipt) {
          var encode_receipt = JSON.stringify(payInvoiceReceipt);
          const reqData = new FormData();
          reqData.append("receipt", encode_receipt);
          const { status, data } = await fetchUser.post(
            `btaf-token-payment/${user_payment_id}`,
            reqData
          );

          navigate(PATH_USER.my_orders.view(data.data.id));
          setLoading(true);
        }
      } catch (e) {
        setLoading(false);
        console.log("Error", e);
      }
    }
  };
  useEffect(() => {
    if (Boolean(token)) {
      fetchData(token);
    }
  }, [token]);

  const onClose = () => deleteParam("token");

  return (
    <Dialog
      open={Boolean(token)}
      maxWidth="xs"
      TransitionComponent={Transition}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">BTAF Payment</Typography>
          <IconButton onClick={onClose} disabled={loading}>
            <Iconify icon="iconamoon:close-bold" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="h6" color="error">
            Please do not close the dialog or refresh the page
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img src="/assets/taftoken.svg" width={100} />
          </Box>
          <Typography variant="body1">
            Please install Metamask before proceed to pay and also use any web3
            enabled browser. If Metamask didn't open up, please click the below
            button
          </Typography>

          <LoadingButton
            size="large"
            loading={loading}
            onClick={fetchData}
            variant="contained"
          >
            proceed to pay
          </LoadingButton>
          <Typography variant="caption" sx={{ textAlign: "center" }}>
            Please wait. The payment can take up to 60 seconds to complete.
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default TafToken;
