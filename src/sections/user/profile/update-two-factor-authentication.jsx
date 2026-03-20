import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import useAuth from "src/hooks/useAuth";

import axiosInstance from "src/utils/axios";
import useUpdateProfileNotification from "./EditInfo/hooks/useUpdateProfileNotification";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const enableGoogleTFA = async () => {
  try {
    const { status, data } = await axiosInstance("api/user/twofa");
    if (status === 200) {
      return { key: data.key, qr: data.qr };
    }

    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const UpdateTwoFactorAuthentication = () => {
  const { user, getUser } = useAuth();
  const { methods, onSubmit } = useUpdateProfileNotification();
  const { setValue } = methods;

  const [enabledTFA, setEnableTFA] = useState(false);
  const [openQrDialog, setOpenQrDialog] = useState(false);
  const [qrData, setQrData] = useState({ qr: "", key: "" });
  const [qrCode, setQrCode] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const enable = async () => {
      const data = await enableGoogleTFA();
      if (data) {
        setQrData(data);
        getUser();
      }
    };

    if (openQrDialog) {
      enable();
    }
  }, [openQrDialog]);

  const enable = async () => {
    const reqData = new FormData();
    reqData.append("key", qrData.key);
    reqData.append("code", qrCode);
    reqData.append("verify", 1);

    try {
      const { status, data } = await axiosInstance.post(
        "api/user/enable-twofa",
        reqData
      );

      if (status === 200) {
        setEnableTFA(true);
        setOpenQrDialog(false);
        enqueueSnackbar(data.message);
        setValue("2fa", true);
        getUser();
      }
    } catch (err) {
      Object.values(err.errors).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };

  const is2FAEnabled = methods.watch("twofa");
  const disable = async () => {
    const reqData = new FormData();
    reqData.append("id", user.id);
    try {
      const { data, status } = await axiosInstance.post(
        "api/user/disable-twofa",
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        setDisableDialog(false);
        setEnableTFA(false);
        setValue("2fa", false);
        getUser();
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
      console.error(err);
    }
  };

  useEffect(() => {
    setEnableTFA(is2FAEnabled);
  }, [is2FAEnabled]);

  const [openDisable, setDisableDialog] = useState(false);

  const handleClick = () => {
    setQrCode("");
  };
  return (
    <>
      <div>
        <Card sx={{ p: 3, mt: 1 }}>
          <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
            <Translate> {"profile.twoStep"}</Translate>
          </Typography>
          <Switch
            checked={enabledTFA}
            name="twofa"
            label="Two Step Authentication"
            onChange={(e) => {
              if (is2FAEnabled) {
                setDisableDialog(true);
                return;
              }
              setOpenQrDialog(e.target.checked);
            }}
          />
        </Card>
      </div>

      <Dialog
        open={openQrDialog}
        onClose={() => setOpenQrDialog(false)}
        TransitionComponent={Transition}
      >
        <DialogContent>
          <Stack spacing={3}>
            <QRCode value={qrData.qr} />

            <TextField
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              placeholder="Scan and enter the OTP"
            />
            <Button
              variant="contained"
              // onClick={enable}
              onClick={() => {
                enable();
                handleClick();
              }}
            >
              Submit
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDisable}
        onClose={() => setDisableDialog()}
        TransitionComponent={Transition}
      >
        <DialogContent>
          Are you sure that you want to continue this action cannot be reversed
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              disable();
            }}
          >
            Proceed
          </Button>
          <Button variant="outlined" onClick={() => setDisableDialog()}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateTwoFactorAuthentication;
