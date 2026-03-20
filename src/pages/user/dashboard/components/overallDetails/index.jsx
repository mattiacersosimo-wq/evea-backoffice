import { Box } from "@mui/material";
import LabeledPaper from "src/components/LabeledPaper";
import DetailCard from "./DetailCard";
import data from "./_data";

const OverallDetails = () => {
  return (
    <LabeledPaper label="Overall Details">
      <Box
        sx={{
          display: "grid",
          columnGap: 2,
          rowGap: 2,
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {data.map((item) => (
          <DetailCard {...item} />
        ))}
      </Box>
    </LabeledPaper>
  );
};

export default OverallDetails;
