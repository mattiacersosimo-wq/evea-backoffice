import { Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

const UserDatesForm = ({ onSubmit, onClose }) => {
  const [createdAt, setCreatedAt] = useState("");
  const [promoterAt, setPromoterAt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!createdAt) {
      return;
    }

    setLoading(true);
    await onSubmit({ created_at: createdAt, promoter_at: promoterAt });
    setLoading(false);
  };

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <TextField
        label="Created At"
        type="date"
        value={createdAt}
        onChange={(e) => setCreatedAt(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        required
      />

      <TextField
        label="Promoter At (Optional)"
        type="date"
        value={promoterAt}
        onChange={(e) => setPromoterAt(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
        <LoadingButton variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </LoadingButton>
        <LoadingButton
          variant="contained"
          onClick={handleClick}
          loading={loading}
          disabled={!createdAt}
        >
          Update Dates
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default UserDatesForm;
