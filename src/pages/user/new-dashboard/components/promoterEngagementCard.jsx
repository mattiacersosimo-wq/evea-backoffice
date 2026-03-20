import { Box, Card, CardContent, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const PromoterEngagementCard = ({ total_pqv, earned_pqv, remaining_pqv }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const totalBars = 10;
  const threshold = total_pqv / 2;
  const filledBars = Math.min(
    Math.floor((earned_pqv / total_pqv) * totalBars) || 0,
    totalBars
  );
  const effectiveFilled = earned_pqv >= total_pqv ? totalBars : filledBars;

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.widgets.eventBg[100],
        borderRadius: 1,
      }}
    >
      <CardContent sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          MLM Promoter Engaged Status
        </Typography>

        <Box
          sx={{ display: "flex", justifyContent: "center", gap: "4px", mb: 3 }}
        >
          {Array.from({ length: totalBars }, (_, i) => {
            let backgroundColor = "#374151";

            if (i < effectiveFilled) {
              backgroundColor = "#10b981";
            } else if (i === Math.floor((threshold / total_pqv) * totalBars)) {
              backgroundColor = "#374151";
            }

            return (
              <Box
                key={i}
                sx={{
                  width: 30,
                  height: 60,
                  backgroundColor,
                  borderRadius: 1,
                  boxShadow: i < effectiveFilled ? "0 0 10px #10b981" : "none",
                  transition: "all 0.3s ease",
                }}
              />
            );
          })}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ color: "#10b981" }}>
              Earned PQV: {earned_pqv} PQV
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: "#9ca3af" }}>
              Remaining: {remaining_pqv} PQV
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PromoterEngagementCard;
