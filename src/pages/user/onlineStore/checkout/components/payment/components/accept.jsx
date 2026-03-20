import { LoadingButton } from "@mui/lab";
import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Translate from "src/components/translate";

const Accept = ({ enableSubmit }) => {
  const [accepted, setAccepted] = useState({ refund: true, swapped: true });
  const { refund, swapped } = accepted;

  const handleAccept = (e) =>
    setAccepted({ ...accepted, [e.target.name]: e.target.checked });
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack>
            <FormControlLabel
              name="refund"
              control={<Checkbox checked={refund} onClick={handleAccept} />}
              label={
                <Typography variant="caption">
                  I understand that no refunds are offered
                </Typography>
              }
            />

            <FormControlLabel
              name="swapped"
              control={<Checkbox checked={swapped} onClick={handleAccept} />}
              label={
                <Typography variant="caption">
                  I understand that products cannot be swapped or changed
                </Typography>
              }
            />
          </Stack>
        </CardContent>
      </Card>
      <LoadingButton
        disabled={!(swapped && refund) || enableSubmit}
        loading={isSubmitting}
        type="submit"
        fullWidth
        size="large"
        variant="contained"
      >
        <Translate>user.online_store.product.complete_order</Translate>{" "}
      </LoadingButton>
    </>
  );
};

export default Accept;
