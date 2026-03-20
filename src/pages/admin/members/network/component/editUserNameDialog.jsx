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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import useErrors from "src/hooks/useErrors";

import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";
import * as yup from "yup";

const validatorSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  new_username: yup
    .string()
    .required("errors.member.username.new_username.required"),
});

const defaultValues = {
  username: "",
  new_username: "",
  _method: "PUT",
};

const EditUserNameDialog = ({ username, onClose, fetchData, open }) => {
  const theme = useTheme();
  const handleErrors = useErrors();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validatorSchema),
  });

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    [...Object.entries(inputData)].forEach(([key, value]) =>
      reqData.append(key, value)
    );

    try {
      const { status, data } = await axiosInstance.post(
        "api/change-user-username",
        reqData
      );
      if (status === 200) {
        fetchData();
        onClose();
        enqueueSnackbar(data.message);
        methods.setValue("new_username", "");
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    if (username) methods.setValue("username", username);
  }, [username]);
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
        <Translate>{"network_members.change_user_name"}</Translate>
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
                label={"network_members.current_user_name"}
                disabled
              />
              <RHFTextField
                name="new_username"
                label={"network_members.new_user_name"}
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
            name="update"
          >
            <Translate>network_members.update</Translate>
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default EditUserNameDialog;
