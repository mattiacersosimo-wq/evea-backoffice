import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

const LegendItemColor = ({ bgColor }) => {
  return (
    <span
      style={{
        borderRadius: "3px",
        marginTop: 1,
        backgroundColor: bgColor,
        padding: 1,
        width: "10px",
        height: "10px",
      }}
    />
  );
};

const LegendItemLabel = ({ label, bgColor }) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ alignItems: "center", display: "flex" }}>
      <LegendItemColor bgColor={bgColor} />
      <Typography
        variant="subtitle2"
        fontWeight="300"
        fontSize="12px"
        marginLeft="5px"
      >
        {t(label)}
      </Typography>
    </Box>
  );
};

const LegendItemValue = ({ value }) => {
  const { palette } = useTheme();

  return (
    <Box
      alignItems="center"
      sx={{
        display: "flex",
        color: palette.grey[600],
        ml: { xl: "5px", lg: "-5px" },
        mr: { xl: "0px", lg: "10px" },
      }}
    >
      <LegendItemColor bgColor="transparent" />
      <Typography fontWeight="400" variant="h6">
        {value}
      </Typography>
    </Box>
  );
};

const Legends = ({ open, closed }) => {
  const { palette } = useTheme();

  return (
    <Stack sx={{ flexDirection: { xl: "column", xs: "row" } }}>
      <Box>
        <Stack sx={{ flexDirection: { xl: "column", xs: "row" } }}>
          <LegendItemLabel
            bgColor={palette.primary.light}
            label="support_tickets.side_bar.open"
          />
          <LegendItemValue value={open} color={palette.widgets.tertiary[600]} />
        </Stack>
      </Box>
      <Box>
        <Stack sx={{ flexDirection: { xl: "column", xs: "row" } }}>
          <LegendItemLabel
            bgColor={palette.primary.dark}
            label="support_tickets.side_bar.closed"
          />
          <LegendItemValue
            value={closed}
            color={palette.widgets.tertiary[600]}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default Legends;
