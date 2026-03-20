import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormProvider } from "src/components/hook-form";
import Translate from "src/components/translate";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";
import * as yup from "yup";
import SponsorSearch from "./sponsors";

const validatorSchema = yup.object().shape({
  sponsor_id: yup.string().required("Sponsor is required"),
});

const defaultValues = {
  sponsor_id: "",
};

const ChangeSponsor = ({ sponsor, onClose, fetchData, selectedId, open }) => {
  const theme = useTheme();
  const handleErrors = useErrors();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validatorSchema),
  });

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    reqData.append("sponsor_id", inputData.sponsor_id);
    reqData.append("user_id", selectedId);

    try {
      const { status, data } = await axiosInstance.post(
        "api/user/sponser-update",
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message, { variant: "success" });
        fetchData(); 
        onClose(); 
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    if (sponsor) methods.setValue("sponsor", sponsor);
  }, [sponsor]);

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
        <Translate>Sponsor Change</Translate>
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
              <SponsorSearch
                name="sponsor_id"
                selectedId={selectedId}
                props={{ size: "medium" }}
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

export default ChangeSponsor;