import { Card, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Translate from "src/components/translate";

const RowStyle = styled("div")({
  display: "flex",
  justifyContent: "space-between",
});

export default function BalanceCard({
  highestRank,
  lastWeek,
  currentRank,
  nextRank,
}) {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {currentRank}
      </Typography>

      <Stack spacing={2}>
        <RowStyle>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Translate>{"affiliate_dashboard.nextRank"}</Translate>
          </Typography>
          <Typography variant="body2">{nextRank}</Typography>
        </RowStyle>

        <RowStyle>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Translate> {"affiliate_dashboard.highestRankAchieved"}</Translate>
          </Typography>
          <Typography variant="body2">{highestRank}</Typography>
        </RowStyle>

        <RowStyle>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Translate> {"affiliate_dashboard.paidAsRankLastWeek"}</Translate>
          </Typography>
          <Typography variant="body2">{lastWeek}</Typography>
        </RowStyle>
        <RowStyle>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Translate>{"affiliate_dashboard.current_paid"}</Translate>
          </Typography>
          <Typography variant="body2">{lastWeek}</Typography>
        </RowStyle>
      </Stack>
    </Card>
  );
}
