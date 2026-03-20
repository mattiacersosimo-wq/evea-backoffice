import { Box, Button, Divider, Card, Stack } from "@mui/material";
import { useState } from "react";
import LabeledBox from "src/components/LabeledBox";
import Items from "./items";
import Rank from "./rank";

const Benefits = () => {
  const [selected, setSelected] = useState("Bronze Executive");

  return (
    <Card sx={{ mt: 2 }}>
      <LabeledBox label={`${selected}: Benefits`}>
        <Rank setSelected={setSelected} />
        <Items selected={selected} />
      </LabeledBox>
      <Divider />
      <Box sx={{ padding: "2rem", margin: "0.8rem 0", width: "fit-content" }}>
        <Stack spacing={2} direction="row">
          <Button variant="contained">Business Builder Active: YES</Button>
          <Button variant="contained">Revenue Plan</Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default Benefits;
