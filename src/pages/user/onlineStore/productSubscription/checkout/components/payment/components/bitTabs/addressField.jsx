import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";

const useAddressField = () => {
  const [showToolTip, setShowToolTip] = useState(false);
  const copyAddress = (text) => () => {
    navigator.clipboard.writeText(text);
    setShowToolTip(true);
  };

  useEffect(() => {
    if (showToolTip) {
      setTimeout(() => {
        setShowToolTip(false);
      }, 1000);
    }
  }, [showToolTip]);

  return { showToolTip, copyAddress };
};

const AddressField = ({ payment_address }) => {
  const { copyAddress, showToolTip } = useAddressField();
  return (
    <TextField
      sx={{ caretColor: "transparent" }}
      value={payment_address}
      variant="outlined"
      fullWidth
      disabled
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip
              placement="right"
              title="Address copied"
              open={showToolTip}
              disableHoverListener
            >
              <IconButton
                onClick={copyAddress(payment_address)}
                size="small"
                edge="end"
                name="copy"
              >
                <Iconify icon="ic:baseline-content-copy" />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default AddressField;
