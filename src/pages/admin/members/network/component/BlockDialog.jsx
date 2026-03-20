import { DialogContent } from "@material-ui/core";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormProvider } from "src/components/hook-form";
import Map from "src/components/map";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

import axiosInstance from "src/utils/axios";
import buildPath from "src/utils/build-path";
import Transition from "src/utils/dialog-animation";

const BlockDialog = ({
  open,
  selectedId,
  onClose,
  fetchData,
  isHoldingTank = false,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({ defaultValues: { type: [] } });
  const [blockTypes, setBlockTypes] = useState([]);

  const {
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const getStatus = async (id) => {
      try {
        const { data } = await axiosInstance.get(
          buildPath("/api/admin/user-block-status", id)
        );
        if (data.data) {
          setValue("type", data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (open && selectedId) {
      getStatus(selectedId);
    }
  }, [open, selectedId]);

  useEffect(() => {
    const fetchBlockType = async () => {
      try {
        const { data } = await axiosInstance.get("/api/admin/block-type", {
          params: {
            is_holdingtank: isHoldingTank ? 1 : null,
          },
        });
        setBlockTypes(
          data.data?.map(({ id, type }) => ({
            type,
            id,
          }))
        );
      } catch (err) {
        console.log(err);
      }
    };
    if (open) fetchBlockType();
  }, [open]);

  const handleBlock = async (inputData) => {
    const reqData = new FormData();
    const { type } = inputData;
    // if (type.length === 0) {
    //   enqueueSnackbar("Cannot Block without selecting any option", {
    //     variant: "error",
    //   });
    //   return;
    // }

    type.forEach((t) => reqData.append("type[]", t));
    reqData.append("_method", "PUT");

    const { status, data: responseData } = await axiosInstance.post(
      `/api/admin/block-user/${selectedId}`,
      reqData
    );

    if (status === 200) {
      enqueueSnackbar(responseData.message);
      onClose();
      fetchData();
      methods.reset();
      return;
    }
    enqueueSnackbar("Failed to block member", { variant: "error" });
  };

  const types = watch("type");
  const onSubmit = handleSubmit(handleBlock);

  const label = [
    { id: 1, label: "global.account_login" },
    { id: 2, label: "global.payout" },
    { id: 3, label: "global.fund_transfer" },
    { id: 4, label: "global.referral" },
  ];

  const mergedArray = label.map((labelItem) => {
    const dataItem = blockTypes.find(
      (dataItem) => dataItem.id === labelItem.id
    );
    return { ...labelItem, ...dataItem };
  });
  const { t } = useTranslation();
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="block-user"
      TransitionComponent={Transition}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle id="block-user">
          <Translate>network_members.update_permissions</Translate>
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
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
              <Typography>
                {("network_members.areYouSure")}
              </Typography>
            </Box>
          </DialogContentText> */}
          <FormControl
            sx={{
              mt: 3,
            }}
          >
            {/* <FormLabel id="demo-radio-buttons-group-label">Choose</FormLabel> */}
            <FormGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
            >
              <Ternary
                when={isHoldingTank}
                then={
                  <Map
                    list={blockTypes}
                    render={({ id, type }) => {
                      const checked = types.indexOf(id) > -1;

                      return (
                        <FormControlLabel
                          key={id}
                          control={
                            <Checkbox
                              value={id}
                              checked={checked}
                              onClick={() => {
                                const types = getValues("type");
                                const itemIndex = types.indexOf(id);
                                if (itemIndex > -1) {
                                  types.splice(itemIndex, 1);
                                  setValue("type", types);
                                } else {
                                  setValue("type", [...types, id]);
                                }
                              }}
                            />
                          }
                          label={`Block ${type}`}
                        />
                      );
                    }}
                  />
                }
                otherwise={
                  <Map
                    list={mergedArray}
                    render={({ id, type, label }) => {
                      const checked = types.indexOf(id) > -1;

                      return (
                        <FormControlLabel
                          key={id}
                          control={
                            <Checkbox
                              value={id}
                              checked={checked}
                              onClick={() => {
                                const types = getValues("type");
                                const itemIndex = types.indexOf(id);
                                if (itemIndex > -1) {
                                  types.splice(itemIndex, 1);
                                  setValue("type", types);
                                } else {
                                  setValue("type", [...types, id]);
                                }
                              }}
                            />
                          }
                          label={t(label)}
                        />
                      );
                    }}
                  />
                }
              />
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} name="cancel" color="error">
            <Translate>{"network_members.cancel"}</Translate>
          </Button>
          <LoadingButton
            variant="contained"
            color="warning"
            name="block"
            type="submit"
            loading={isSubmitting}
          >
            <Translate>{"network_members.update"}</Translate>
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default BlockDialog;
