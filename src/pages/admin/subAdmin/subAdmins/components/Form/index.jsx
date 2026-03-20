import { LoadingButton } from "@mui/lab";
import { Box, Stack } from "@mui/material";
import Products from "src/components/auto-complete/products";
import Departments from "src/components/autoComplete/departments";

import Password from "src/components/Password.jsx";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import useAddSubAdmin from "src/pages/admin/subAdmin/subAdmins/hooks/useAddSubAdmin.js";
import { isValidString } from "src/utils/validators";
import AdminGroups from "./AdminGroups";

const InputWrapper = ({ children }) => (
  <Box
    sx={{
      display: "grid",
      columnGap: 2,
      rowGap: 3,
      gridTemplateColumns: "repeat(2, 1fr)",
    }}
  >
    {children}
  </Box>
);

const Form = () => {
  const { methods, onSubmit } = useAddSubAdmin();

  const { isSubmitting } = methods.formState;
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <InputWrapper>
        <RHFTextField
          name="name"
          type="text"
          label={"sub_admin.name"}
          // onChange={({ target: { value } }) =>
          //   isValidString(value) && methods.setValue("name", value)
          // }
          // onBlur={(e) => methods.setValue("name", e.target.value.trim())}
        />
        <RHFTextField name="mobile" label={"sub_admin.mobile"} />
        {/* <Products name="product_ids" multiple limitTags={2} /> */}
        {/* <Products
          name="excluded_products"
          multiple
          limitTags={2}
          label={t("sub_admin.excluded_products")}
        /> */}
        {/* <Departments name="department_ids" multiple limitTags={2} /> */}
        <AdminGroups />

        <RHFTextField name="email" type="email" label={"sub_admin.email"} />
        <RHFSelect
          name="is_impersonation"
          label={t("sub_admin.enable_impersonation")}
        >
          <option value={1}>{t("sub_admin.enable")}</option>
          <option value={0}>{t("sub_admin.disable")}</option>
        </RHFSelect>
        <RHFTextField
          name="username"
          type="text"
          label={"sub_admin.userName"}
        />
        <Password name="password" label={t("sub_admin.password")} />
        <Password
          name="confirmPassword"
          label={t("sub_admin.re_enter_password")}
        />
      </InputWrapper>
      <Stack alignItems="flex-end" sx={{ mt: 3 }}>
        <LoadingButton
          id="sub-admin_submit"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          <Translate>{"sub_admin.submit"}</Translate>
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
};

export default Form;
