import { Box, Card, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router";
import TopPanel from "./topPanel";

const Events = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState("upcoming-events");
  const navigate = useNavigate();
  const handleChange = (_, newValue) => {
    navigate(newValue);
    setValue(newValue);
  };

  return (
    <Stack spacing={2}>
      <Card sx={{ padding: "2rem" }}>
        <Typography variant="h6">{t("business_builder.materials.events.title")}</Typography>
        <TopPanel />
      </Card>

      <Card sx={{ padding: "2rem" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab value="upcoming-events" label={t("business_builder.materials.events.upcoming")} />
            <Tab value="past-events" label={t("business_builder.materials.events.past")} />
          </Tabs>
        </Box>

        <Outlet />
      </Card>
    </Stack>
  );
};

export default Events;
