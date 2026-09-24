import { Box, Button, Divider, Card, Stack } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LabeledBox from "src/components/LabeledBox";
import Items from "./items";
import Rank from "./rank";

const Benefits = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("Bronze Executive");

  return (
    <Card sx={{ mt: 2 }}>
      <LabeledBox label={t("dashboard.benefits.label", { rank: selected })}>
        <Rank setSelected={setSelected} />
        <Items selected={selected} />
      </LabeledBox>
      <Divider />
      <Box sx={{ padding: "2rem", margin: "0.8rem 0", width: "fit-content" }}>
        <Stack spacing={2} direction="row">
          <Button variant="contained">{t("dashboard.benefits.business_builder_active")}</Button>
          <Button variant="contained">{t("dashboard.benefits.revenue_plan")}</Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default Benefits;
