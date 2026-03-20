import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import useErrors from "src/hooks/useErrors";

import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";
import * as Yup from "yup";

const validationSchema = Yup.object({
  username: Yup.string().required("errors.member.password.username.required"),
  password: Yup.string()
    .min(8, "errors.member.password.password.min")
    .required("errors.member.password.password.required"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "errors.member.password.confirmPassword.oneOf"
    )
    .required("errors.member.password.confirmPassword.required"),
});

const defaultValues = {
  username: "",
  password: "",
  confirmPassword: "",
  _method: "PUT",
};

const UpdatePasswordDialog = ({ open, username, onClose, fetchData }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();
  const handleErrors = useErrors();
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    delete inputData.confirmPassword;

    [...Object.entries(inputData)].forEach(([key, value]) =>
      reqData.append(key, value)
    );

    try {
      const { status, data } = await axiosInstance.post(
        "api/admin/change-user-password",
        reqData
      );
      if (status === 200) {
        fetchData();
        onClose();
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    if (username) methods.setValue("username", username);
  }, [username]);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="change-username"
      TransitionComponent={Transition}
    >
      <DialogTitle id="change-username">
        <Translate> {"network_members.change_password"}</Translate>
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                marginTop: 3,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                },
              }}
            >
              <RHFTextField
                name="username"
                label={"network_members.username"}
                disabled
              />
              <RHFTextField
                name="password"
                label={"network_members.password"}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Iconify
                          icon={
                            showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="confirmPassword"
                label={"network_members.confirm_password"}
                type={showRePassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowRePassword(!showRePassword)}
                      >
                        <Iconify
                          icon={
                            showRePassword ? "eva:eye-fill" : "eva:eye-off-fill"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} autoFocus color="error">
            <Translate>network_members.close</Translate>
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={methods.formState.isSubmitting}
          >
            <Translate>network_members.update</Translate>
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default UpdatePasswordDialog;
