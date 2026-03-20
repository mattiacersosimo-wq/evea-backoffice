import { DialogContent } from "@material-ui/core";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import Iconify from "src/components/Iconify";
import Products from "src/components/auto-complete/products";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import axiosInstance from "src/utils/axios";
import useSubAdminForm from "../subAdmins/hooks/useSubAdminForm";
import AdminGroups from "./components/AdminGroups";
import Transition from "src/utils/dialog-animation";

const EditDialog = ({ open, selectedId, onClose, fetchData }) => {
  const { palette } = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useSubAdminForm(true);

  const fetchAdminData = async () => {
    try {
      const { status, data } = await axiosInstance.get(
        `api/admin/sub-admins/${selectedId}`
      );

      if (status === 200) {
        const {
          active,
          is_impersonation,
          sub_admin_departments,
          sub_admin_products,
          sub_admin_excluded_products,
          user,
          group_id,
        } = data.data;
        methods.reset({
          active,
          name: user?.user_profile?.first_name,
          mobile: user?.user_profile?.mobile,
          username: user?.username,
          email: user?.email,
          group_id,
          is_impersonation,
          department_ids: sub_admin_departments?.map(({ id }) => id),
          product_ids: sub_admin_products?.map(({ id }) => id),
          excluded_products: sub_admin_excluded_products?.map(({ id }) => id),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  const { t } = useTranslation();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    const { product_ids, department_ids, excluded_products, ...rest } =
      inputData;
    Object.entries(rest).forEach(([key, value]) => reqData.append(key, value));
    reqData.append("product_ids", `[${product_ids}]`);
    reqData.append("department_ids", `[${department_ids}]`);
    reqData.append("excluded_products", `[${excluded_products}]`);
    reqData.append("_method", "PUT");

    try {
      const { status, data } = await axiosInstance.post(
        `api/admin/sub-admins/${selectedId}`,
        reqData
      );

      if (status === 200) {
        fetchData();
        enqueueSnackbar(data.message);
        onClose();
      }
    } catch (err) {
      Object.entries(err.errors).forEach(([k, v]) =>
        methods.setError(k, { message: v[0] })
      );
    }
  };

  useEffect(() => {
    if (open) fetchAdminData();
  }, [open]);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-subadmin"
      TransitionComponent={Transition}
    >
      <DialogTitle
        id="delete-subadmin"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="span" sx={{ color: "#444" }}>
          <Translate>{"sub_admin.edit_sub_admin"}</Translate>
        </Typography>
        <IconButton aria-label="close" onClick={onClose}>
          <Iconify icon="ic:baseline-close" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormProvider
            methods={methods}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <Box
              sx={{
                display: "grid",
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
            >
              <RHFTextField name="name" type="text" label={"sub_admin.name"} />
              <RHFTextField
                name="mobile"
                type="number"
                label={"sub_admin.mobile"}
              />

              {/* <Products */}

              {/* <Products name="product_ids" multiple /> */}
              {/* <Products
                name="excluded_products"
                multiple
                label={t("sub_admin.excluded_products")}
              /> */}
              {/* <Departments name="department_ids" multiple /> */}
              <AdminGroups />

              <RHFTextField
                name="email"
                type="email"
                label={"sub_admin.email"}
              />
              <RHFSelect
                name="is_impersonation"
                label={"sub_admin.enable_impersonation"}
              >
                <option value={1}>{t("sub_admin.enable")} </option>
                <option value={0}>{t("sub_admin.disable")} </option>
              </RHFSelect>
              <RHFTextField
                name="username"
                type="text"
                label={"sub_admin.userName"}
              />
            </Box>
            <DialogActions>
              <Button onClick={onClose} sx={{ color: palette.warning.normal }}>
                <Translate> {"sub_admin.cancel"}</Translate>
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={methods.formState.isSubmitting}
              >
                <Translate> {"sub_admin.submit"}</Translate>
              </LoadingButton>
            </DialogActions>
          </FormProvider>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
