import React from "react";
// @mui
import { Box, Card, Alert, CardHeader, Stack } from "@mui/material";

const SubEvents = () => {
  return (
    <>
      <Box>
        <Card>
          <Box sx={{ p: 3 }}>
            <CardHeader title="My Active Subscription Events" />
            <Stack sx={{ width: "100%", mt: "2rem" }} spacing={2}>
              <Alert severity="success">
                Subscribe To Our Products For More Information On Private
                Events.
              </Alert>
            </Stack>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default SubEvents;
