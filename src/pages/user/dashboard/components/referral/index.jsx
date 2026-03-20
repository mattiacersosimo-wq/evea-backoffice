import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useRef } from "react";
import Iconify from "src/components/Iconify";
import LabeledPaper from "src/components/LabeledPaper";

const Referral = () => {
  const value = useRef("https://react-test.cloudmlmdemo.com/");
  const { enqueueSnackbar } = useSnackbar();
  const copy = async () => {
    await navigator.clipboard.writeText(value.current);
    enqueueSnackbar("Copied to clipboard");
  };

  return (
    <LabeledPaper label="Referral">
      <TextField
        sx={{
          margin: "0.8rem 0",
        }}
        fullWidth
        value={value.current}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => copy()}>
                <Iconify icon="bxs:copy" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </LabeledPaper>
  );
};

export default Referral;
