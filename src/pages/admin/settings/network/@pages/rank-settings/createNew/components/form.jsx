import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import useRankAdd from "../hooks/useRankAdd";
import HideFromForm from "./hide-from-form";

const Form = ({
  productList,
  config,
  methods,
  onSubmit,
  cancel,
  isEdit = false,
}) => {
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle id="add-faqs">
        <Translate>global.addNewRank</Translate>
      </DialogTitle>
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
                sm: "repeat(2, 1fr)",
              },
            }}
          >
            <RHFTextField
              fullWidth
              rows={3}
              placeholder={t("global.rankName")}
              name="rank_name"
            />
            <HideFromForm data={config?.package_id}>
              <RHFSelect
                disabled={config?.package_id === 0}
                name="package_id"
                label={t("global.package")}
              >
                <option value="" />
                {productList?.map((item) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
              </RHFSelect>
            </HideFromForm>
            <HideFromForm data={config?.referral_count}>
              <RHFTextField
                fullWidth
                rows={3}
                placeholder={t("global.Referral_Count")}
                name="referral_count"
              />
            </HideFromForm>
            <HideFromForm data={config?.team_volume}>
              <RHFTextField
                fullWidth
                rows={3}
                placeholder={t("global.Team_Volume")}
                name="team_volume"
              />
            </HideFromForm>
            <HideFromForm data={config?.personal_volume}>
              <RHFTextField
                fullWidth
                rows={3}
                placeholder={t("global.Personal_Volume")}
                name="personal_volume"
              />
            </HideFromForm>
            <HideFromForm data={config?.referral_package}>
              <RHFSelect
                disabled={config?.referral_package === 0}
                name="referral_package"
                label={t("global.Referral_Package")}
              >
                <option value="" />
                {productList?.map((item) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
              </RHFSelect>
            </HideFromForm>
            <HideFromForm data={config?.referral_package}>
              <RHFTextField
                fullWidth
                rows={3}
                placeholder={t("global.Referral_Package_Count")}
                name="referral_package_count"
              />
            </HideFromForm>
            <RHFTextField
              fullWidth
              disabled={config?.bonus_amount === 0}
              rows={3}
              placeholder={t("global.rank_bonus")}
              name="bonus_amount"
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel} autoFocus color="error" name="faq-close">
          <Translate>faq.faqs.form.cancel</Translate>
        </Button>
        <LoadingButton
          loading={methods.formState.isSubmitting}
          type="submit"
          variant="contained"
          name="faq-submit"
        >
          <Ternary
            when={isEdit}
            then={<Translate>faq.faqs.form.update</Translate>}
            otherwise={<Translate>faq.faqs.form.add</Translate>}
          />
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export const AddRankForm = ({ productList, config, cancel, fetchData }) => {
  const add = useRankAdd(() => {
    fetchData();
    cancel();
  }, config);

  return (
    <Form productList={productList} config={config} {...add} cancel={cancel} />
  );
};

export default Form;
