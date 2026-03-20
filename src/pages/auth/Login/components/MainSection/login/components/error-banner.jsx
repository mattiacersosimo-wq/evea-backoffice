import { Alert } from "@mui/material";
import { useFormContext } from "react-hook-form";

const ErrorBanner = () => {
  const {
    formState: { errors },
  } = useFormContext();
  return (
    !!errors.afterSubmit && (
      <Alert severity="error">{errors?.afterSubmit?.message}</Alert>
    )
  );
};

export default ErrorBanner;
