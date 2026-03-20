import { Box, Card, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import TopPanel from "./topPanel";

const Events = () => {
  const [value, setValue] = useState("upcoming-events");
  const navigate = useNavigate();
  const handleChange = (_, newValue) => {
    navigate(newValue);
    setValue(newValue);
  };

  return (
    <Stack spacing={2}>
      <Card sx={{ padding: "2rem" }}>
        <Typography variant="h6">Events</Typography>
        <TopPanel />
      </Card>

      <Card sx={{ padding: "2rem" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab value="upcoming-events" label="Upcoming Events" />
            <Tab value="past-events" label="Past Events" />
          </Tabs>
        </Box>

        <Outlet />
      </Card>
    </Stack>
  );
};

export default Events;
