import React from "react";
import {
  Box,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import Scrollbar from "src/components/Scrollbar";

import { useTheme } from "@mui/material/styles";

const Progress = ({ label, value }) => {
  const theme = useTheme();


  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Typography sx={{ paddingBottom: "0.3rem", fontSize: "14px", color:theme.palette.grey[600], lineHeight:1 }}>
          {label}
        </Typography>
        <Typography sx={{ paddingBottom: "0.3rem", fontSize: "13px", fontWeight:"400",  color:theme.palette.grey[500], lineHeight:1 }}>
          2 remaining
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={value} />
    </Box>
  );
};
const NetworkProgress = () => (
  <Box variant="outlined" sx={{ px: "5px", py: "20px", ml:"-15px", width:"calc(100% + 40px)" }}>
    <Typography variant="subtitle1" sx={{ my: 2, px:"15px"  }}>
      Rank Progress
    </Typography>

    <Scrollbar sx={{ height: "215px", overflowY: "auto", px:"15px" }}>
    <Stack spacing={2.6}>
      <Progress label="Business Builder" value={11} />
      <Progress label="Bronze executive" value={50} />
      <Progress label="Silver executive" value={20} />
      <Progress label="Gold executive" value={30} />
      <Progress label="Emerald executive" value={5} />
    </Stack>
    </Scrollbar>
  </Box>
);

export default NetworkProgress;
