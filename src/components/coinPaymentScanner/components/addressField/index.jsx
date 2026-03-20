import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import Iconify from "src/components/Iconify";
import useAddressField from "./hooks/useAddressField";

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
