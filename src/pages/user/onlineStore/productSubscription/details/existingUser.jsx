import { Box, Button, DialogActions } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "src/components/hook-form";

import { object, string } from "yup";

const schema = object().shape({
  user_id: string().required("Username is required"),
});

const ExistingUser = ({ onClose, addToCart }) => {
  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = () => {
    addToCart();
    onClose();
  };
  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Box
        sx={{
          // TODO: Need to change this margin only a hack
          marginTop: "1rem",
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(1, 1fr)",
            md: "repeat(1, 1fr)",
            lg: "repeat(1, 1fr)",
          },
        }}
      >
        <RHFTextField label="Username" name="user_id" />
      </Box>

      <DialogActions>
        <Button autoFocus variant="contained" type="submit">
          {"profuctDetails.buy"}
        </Button>
        <Button onClick={onClose} autoFocus>
          {"profuctDetails.cancel"}
        </Button>
      </DialogActions>
    </FormProvider>
  );
};

export default ExistingUser;
