import { Box, Card, Stack, Typography, useTheme } from "@mui/material";
import Styles from "./style.module.css";

const LegendItem = ({ icon, title, content }) => {
  const { palette } = useTheme();
  return (
    <>
      <Card className={Styles.rightCard} style={{ marginBottom: "0.75rem" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              flexShrink: 0,
              display: "flex",
              borderRadius: 1.5,
              alignItems: "center",
              justifyContent: "center",
              bgcolor: palette.primary.lighter,
              color: palette.primary.main,
            }}
          >
            {icon}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ fontSize: "12px" }}>
              {title}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ mt: 0.5, color: "text.secondary" }}
            >
              <Typography variant="caption">{content}</Typography>
            </Stack>
          </Box>
        </Stack>
      </Card>
    </>
  );
};

export default LegendItem;
