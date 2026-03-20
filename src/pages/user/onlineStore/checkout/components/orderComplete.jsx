import { Box, Button, Divider, Link, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { OrderCompleteIllustration } from "src/assets";
import Iconify from "src/components/Iconify";
import { DialogAnimate } from "src/components/animate";

import { resetCart } from "src/redux/slices/product";
import { useDispatch } from "src/redux/store";
import { PATH_USER } from "src/routes/paths";

const DialogStyle = styled(DialogAnimate)(({ theme }) => ({
  "& .MuiDialog-paper": {
    margin: 0,
    [theme.breakpoints.up("md")]: {
      maxWidth: "calc(100% - 48px)",
      maxHeight: "calc(100% - 48px)",
    },
  },
}));

const OrderComplete = ({ ...other }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleResetStep = () => {
    dispatch(resetCart());
    navigate(PATH_USER.onlineStore.productSubscription.root);
  };

  return (
    <DialogStyle fullScreen {...other}>
      <Box sx={{ p: 4, maxWidth: 480, margin: "auto" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" paragraph>
            {"userOnlineStore.thankPurchase"}
          </Typography>

          <OrderCompleteIllustration sx={{ height: 260, my: 10 }} />

          <Typography align="left" paragraph>
            {"userOnlineStore.thanksPlacing"} &nbsp;
            <Link href="#">01dc1370-3df6-11eb-b378-0242ac130002</Link>
          </Typography>

          <Typography align="left" sx={{ color: "text.secondary" }}>
            {"userOnlineStore.weWillSend"}
            <br /> <br />
            {"userOnlineStore.ifYouHave"}
            {"userOnlineStore.inContactUs"} <br /> <br />{" "}
            {"userOnlineStore.allTheBest"},
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Button
            color="inherit"
            onClick={handleResetStep}
            startIcon={<Iconify icon={"eva:arrow-ios-back-fill"} />}
          >
            {"userOnlineStore.continueShopping"}
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon={"ant-design:file-pdf-filled"} />}
            onClick={handleResetStep}
          >
            {"userOnlineStore.downloadAs"}
          </Button>
        </Stack>
      </Box>
    </DialogStyle>
  );
};

export default OrderComplete;
