import { LoadingButton } from "@mui/lab";
import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FormProvider, RHFCheckbox, RHFSelect } from "src/components/hook-form";
import LabelStyle from "src/components/label-style";
import useUpdate from "./hooks/use-update";
import Translate from "src/components/translate";
import { useState } from "react";

const Configuration = ({
  setSelectedValue,
  selectedValue,
  methods,
  fetchConfig,
}) => {
  const onSubmit = useUpdate(fetchConfig, selectedValue);

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
    watch,
    reset,
  } = methods;

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const package_id = watch("package_id");

  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ p: 2 }}>
        <LabelStyle>
          <Translate>global.Rank_Criteria</Translate>
        </LabelStyle>
        {/* <RHFSelect
          sx={{ mt: 1 }}
          label="Rank Criteria"
          select
          fullWidth
          SelectProps={{ native: true }}
          size="small"
          style={{ width: 190 }}
          name="rank_criteria"
        > */}
        <TextField
          select
          fullWidth
          SelectProps={{ native: true }}
          size="small"
          style={{ width: 190 }}
          name={"rank_criteria"}
          value={selectedValue}
          onChange={handleChange}
        >
          <option value="daily">{t("global.daily")}</option>
          <option value="monthly">{t("global.monthly")}</option>
          <option value="instant">{t("global.instant")}</option>
        </TextField>
      </Box>
      <Box sx={{ p: 2 }}>
        <LabelStyle>
          <Translate>global.Options</Translate>
        </LabelStyle>
        <FormControlLabel
          onChange={(e) => {
            if (e.target.checked) {
              reset({
                package_id: 1,
                referral_count: 0,
                team_volume: 0,
                personal_volume: 0,
                personal_volume: 0,
                referral_package: 0,
              });
            } else {
              setValue("package_id", 0);
            }
          }}
          control={<Checkbox checked={Boolean(package_id)} />}
          label={t("global.package")}
        />

        <RHFCheckbox
          disabled={Boolean(package_id)}
          name="referral_count"
          label={t("global.Referral_Count")}
        />
        <RHFCheckbox
          disabled={Boolean(package_id)}
          name="team_volume"
          label={t("global.Team_Volume")}
        />
        <RHFCheckbox
          disabled={Boolean(package_id)}
          name="personal_volume"
          label={t("global.Personal_Volume")}
        />
        <RHFCheckbox
          disabled={Boolean(package_id)}
          name="referral_package"
          label={t("global.Referral_Package")}
        />
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
