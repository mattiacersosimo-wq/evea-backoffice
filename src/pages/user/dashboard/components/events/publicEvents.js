import React from "react";
// @mui
import { Box, Card, CardHeader, Button } from "@mui/material";
// components
import Iconify from "src/components/Iconify";
import PublicEventCard from "./publicEventCard";

const PublicEvents = () => {
  return (
    <>
      <Box>
        <Card>
          <PublicEventCard />
        </Card>
      </Box>
    </>
  );
};

export default PublicEvents;
