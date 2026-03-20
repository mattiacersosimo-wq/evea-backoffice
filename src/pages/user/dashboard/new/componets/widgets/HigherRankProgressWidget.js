import { Box, Card, LinearProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";

import palette from "src/theme/palette";
import fetchUser from "src/utils/fetchUser";

const useHigherRank = () => {
  const [higherRank, setHigherRank] = useState([]);
  const handleErrors = useErrors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await fetchUser("rank-progress");
        if (status === 200) {
          setHigherRank(data.data);
        }
      } catch (err) {
        handleErrors(err);
      }
    };
    fetchData();
  }, []);
  return higherRank;
};

const Progress = ({ label, value }) => {
  return (
    <Box>
      <Typography sx={{ paddingBottom: "0.3rem" }}>{label}</Typography>
      <LinearProgress variant="determinate" value={value} />
    </Box>
  );
};

const HigherRankProgressWidget = () => {
  const higherRank = useHigherRank();

  return (
    <div>
      <Card sx={{ padding: "2rem", borderRadius: "7px" }} variant="outlined">
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {"userDashboard.higherRankProgress"}
        </Typography>
        <Stack spacing={2}>
          {higherRank.map(({ rank_name, percentage, id }) => (
            <Progress
              key={id}
              label={
                <Typography variant="subtitle2" sx={{ fontSize: "13px" }}>
                  {rank_name}
                </Typography>
              }
              value={percentage}
            />
          ))}
        </Stack>
      </Card>
    </div>
  );
};

export default HigherRankProgressWidget;
