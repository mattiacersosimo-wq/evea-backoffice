import { Box, Dialog } from "@mui/material";
import QRCode from "react-qr-code";
import { FormProvider } from "src/components/hook-form";
import TwoFactorVerificationDialog from "../two-factor-verification-dialog";
import useEnable from "./hooks/useEnable";
import Transition from "src/utils/dialog-animation";

const Enable = ({ open, onClose }) => {
  const { methods, qrCode, onSubmit } = useEnable(open, () => {
    onClose();
  });

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="xs"
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <TwoFactorVerificationDialog
          qrCode={
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <QRCode value={qrCode} />
            </Box>
          }
        />
      </FormProvider>
    </Dialog>
  );
};

export default Enable;
