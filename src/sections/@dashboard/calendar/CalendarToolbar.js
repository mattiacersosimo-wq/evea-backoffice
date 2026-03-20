import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";
import { fDate } from "src/utils/formatTime";

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  padding: theme.spacing(1.5),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));

CalendarToolbar.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onNextDate: PropTypes.func,
  onPrevDate: PropTypes.func,
  onChangeView: PropTypes.func,
};

export default function CalendarToolbar({ date, onNextDate, onPrevDate }) {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2">Events Calendar</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", justifyContent: "right" }}>
            <Stack direction="row" alignItems="center">
              <IconButton onClick={onPrevDate}>
                <Iconify
                  icon="eva:arrow-ios-back-fill"
                  width={15}
                  height={15}
                />
              </IconButton>

              <Typography
                variant="subtitle2"
                sx={{ p: 2, marginLeft: 0, color: "#637381" }}
              >
                <ParseDate date={date} />
              </Typography>

              <IconButton onClick={onNextDate}>
                <Iconify
                  icon="eva:arrow-ios-forward-fill"
                  width={15}
                  height={15}
                />
              </IconButton>
            </Stack>
          </Box>
        </Grid>
      </Grid>
      {/* <RootStyle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={onPrevDate}>
            <Iconify icon="eva:arrow-ios-back-fill" width={20} height={20} />
          </IconButton>

          <Typography variant="h5">{fDate(date)}</Typography>

          <IconButton onClick={onNextDate}>
            <Iconify icon="eva:arrow-ios-forward-fill" width={20} height={20} />
          </IconButton>
        </Stack>
      </RootStyle> */}
    </>
  );
}
