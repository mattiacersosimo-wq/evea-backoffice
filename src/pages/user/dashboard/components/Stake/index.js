import PropTypes from "prop-types";
// @mui
import { styled } from "@mui/material/styles";
import { Card, Typography, Box, Button } from "@mui/material";
// utils
import { fShortenNumber } from "src/utils/formatNumber";
// components
import StakeLogo from "src/images/btc-staking.png";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2, 2, 2, 3),
}));

// ----------------------------------------------------------------------

StakeCard.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.string,
  total: PropTypes.number,
};

export default function StakeCard({ title, total, icon }) {
  return (
    <RootStyle>
      <div>
        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
          Staking
        </Typography>
        <Typography variant="h3">BTAF Token</Typography>
        <Button variant="contained" sx={{ mt: 1 }}>
          stake now
        </Button>
      </div>
      <Box
        sx={{
          width: 120,
          height: 120,
          lineHeight: 0,
          borderRadius: "50%",
          bgcolor: "background.neutral",
        }}
      >
        <img src={StakeLogo} />
      </Box>
    </RootStyle>
  );
}
