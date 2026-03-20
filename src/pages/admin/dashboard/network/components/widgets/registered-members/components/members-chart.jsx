import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useMemo } from "react";
import { Pie, PieChart } from "recharts";
import Translate from "src/components/translate";

const MembersChart = ({ label, total, portion }) => {
  const { palette } = useTheme();

  const data = useMemo(() => {
    const percent = (portion / total) * 100;

    return [
      {
        name: "Used",
        value: percent,
        fill: palette.primary.main,
      },
      {
        name: "Not Used",
        value: 100 - percent,
        fill: palette.grey[300],
      },
    ];
  }, [total, portion]);

  return (
    <Box sx={{ display:"flex",alignItems:"center", flexDirection:"column", textAlign:"center", mt:1.5 }}>
      <PieChart width={70} height={70}>
        <text
          x={35}
          y={35}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={palette.text.primary}
        >
          {portion}
        </text>

        <Pie
          startAngle={540}
          endAngle={180}
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={35}
          innerRadius={28}
          fill="#8884d8"
        />
      </PieChart>

      <Typography mt={1} variant="subtitle3" sx={{fontWeight:"300", fontSize:"14px"}}>
        <Translate>{label}</Translate>
      </Typography>
    </Box>
  );
};

export default MembersChart;
