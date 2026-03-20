import { LoadingButton } from "@mui/lab";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FormProvider, RHFCheckbox, RHFSelect } from "src/components/hook-form";
import LabelStyle from "src/components/label-style";
import Translate from "src/components/translate";
import useUpdate from "./hooks/use-update";

const Configuration = ({ methods, fetchConfig }) => {
  const onSubmit = useUpdate(fetchConfig);

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
    watch,
    reset,
  } = methods;

  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ p: 2 }}>
        <LabelStyle>
          <Translate>global.Binary_Criteria</Translate>
        </LabelStyle>
        <RHFSelect
          sx={{ mt: 1 }}
          label={t("global.Binary_Criteria")}
          select
          fullWidth
          SelectProps={{ native: true }}
          size="small"
          style={{ width: 190 }}
          name="period"
        >
          <option value="daily">{t("global.daily")}</option>
          <option value="weekly">{t("global.weekly")}</option>
        </RHFSelect>
      </Box>
      <Box
        sx={{
          p: 2,
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <LoadingButton type="submit" loading={isSubmitting} variant="contained">
          <Translate>settings.network.update</Translate>
        </LoadingButton>
      </Box>
    </FormProvider>
  );
};

export default Configuration;
