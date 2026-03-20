import { Box, Grid } from "@mui/material";

import { useTranslation } from "react-i18next";
import GetReport from "src/components/getReport";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import Users from "src/components/users";
import Ranks from "./ranks";

const DataFilter = ({ methods, onFilter }) => {
  const { t } = useTranslation();
  return (
    <>
      <Grid item xs={12} md={12} sx={{ p: 2, mb: 2 }}>
        <FormProvider methods={methods} onSubmit={onFilter}>
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
              rowGap: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(5, 1fr)",
              },
            }}
          >
            <Users
              label={t("network_members.username")}
              name="user_id"
              size="small"
            />
            <RHFTextField
              name="email"
              label={t("network_members.email")}
              size="small"
            />
            <Ranks />
            <RHFSelect
              name="active"
              label={"network_members.account_status"}
              size="small"
            >
              <option />
              <option value={1}>{t("network_members.active")}</option>
              <option value={0}>{t("network_members.blocked")}</option>
            </RHFSelect>
            <RHFSelect
              name="engaged"
              label={"network_members.engaged_status"}
              size="small"
            >
              <option />
              <option value={1}>{t("network_members.true")}</option>
              <option value={0}>{t("network_members.false")}</option>
            </RHFSelect>
            <RHFSelect
              name="is_smartship_customer"
              label={"network_members.is_smartship_customer"}
              size="small"
            >
              <option />
              <option value={1}>{t("network_members.yes")}</option>
              <option value={0}>{t("network_members.no")}</option>
            </RHFSelect>
            <RHFSelect
              name="is_promoter"
              label={"network_members.user_type"}
              size="small"
            >
              <option />
              <option value={1}>{t("network_members.promoter")}</option>
              <option value={0}>{t("network_members.customer")}</option>
            </RHFSelect>
            <GetReport />
          </Box>
        </FormProvider>
      </Grid>
    </>
  );
};

export default DataFilter;
