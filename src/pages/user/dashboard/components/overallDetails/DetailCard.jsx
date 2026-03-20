import { Paper, Stack, Typography } from "@mui/material";
import Iconify from "src/components/Iconify";

const DetailCard = ({ icon, label, subTitle }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        height: "197.222px",
        padding: "30px 15px",
        cursor: "pointer",
      }}
    >
      <Stack
        spacing={1.5}
        justifyContent="space-evenly"
        alignItems="center"
        sx={{
          height: "100%",
        }}
      >
        <Iconify
          icon={icon}
          sx={{
            fontSize: "3rem",
          }}
        />
        <Stack spacing={0.5} justifyContent="space-evenly" alignItems="center">
          <Typography fontWeight="bold">{label}</Typography>
          <Typography variant="caption">{subTitle}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default DetailCard;
