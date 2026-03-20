import { Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

const ChangeDateForm = ({ onSubmit, onClose }) => {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!date) return;

    setLoading(true);
    await onSubmit({ date });
    setLoading(false);
  };

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <TextField
        label="New Order Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
        <LoadingButton
          variant="outlined"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          variant="contained"
          onClick={handleClick}
          loading={loading}
          disabled={!date}
        >
          Update Date
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default ChangeDateForm;