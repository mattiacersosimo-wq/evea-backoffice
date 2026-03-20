import PropTypes from "prop-types";
import { useRef } from "react";
import Slider from "react-slick";
// @mui
import {
  Avatar,
  AvatarGroup,
  Box,
  CardHeader,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
// utils
import { fDateTime } from "src/utils/formatTime";
// _mock_
import { _bookingNew } from "src/_mock";
// components
import { CarouselArrows } from "src/components/carousel";
import Iconify from "src/components/Iconify";
import Image from "src/components/Image";
import Label from "src/components/Label";

// ----------------------------------------------------------------------

export default function BookingNewestBooking() {
  const theme = useTheme();
  const carouselRef = useRef(null);

  const settings = {
    dots: false,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === "rtl"),
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Box sx={{ py: 2 }}>
      <CardHeader
        title="Left Team"
        action={
          <CarouselArrows
            customIcon={"ic:round-keyboard-arrow-right"}
            onNext={handleNext}
            onPrevious={handlePrevious}
            sx={{ "& .arrow": { width: 28, height: 28, p: 0 } }}
          />
        }
        sx={{
          p: 0,
          mb: 3,
          "& .MuiCardHeader-action": { alignSelf: "center" },
        }}
      />

      <Slider ref={carouselRef} {...settings}>
        {_bookingNew.map((item) => (
          <LeftTeamList key={item.id} item={item} />
        ))}
      </Slider>
    </Box>
  );
}

// ----------------------------------------------------------------------

LeftTeamList.propTypes = {
  item: PropTypes.shape({
    avatar: PropTypes.string,
    bookdAt: PropTypes.instanceOf(Date),
    cover: PropTypes.string,
    name: PropTypes.string,
    person: PropTypes.string,
    roomNumber: PropTypes.string,
    roomType: PropTypes.string,
  }),
};

function LeftTeamList({ item }) {
  const { avatar, name } = item;

  return (
    <Paper sx={{ mx: 1.5, borderRadius: 2, bgcolor: "background.neutral" }}>
      <Stack spacing={2.5} sx={{ p: 3, pb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <div>
            <Typography variant="subtitle2">
              {" "}
              <Iconify icon="el:star-alt" /> &nbsp;&nbsp;Active Users
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", mt: 0.5, display: "block" }}
            >
              234
            </Typography>
          </div>
        </Stack>
        <LinearProgress variant="determinate" value={20} color="primary" />
        <Box>
          <AvatarGroup
            max={4}
            sx={{
              "& .MuiAvatar-root": { width: 32, height: 32 },
            }}
            total={24}
          >
            <Avatar
              alt="Remy Sharp"
              src="https://api-prod-minimal-v4.vercel.app/assets/images/avatars/avatar_1.jpg"
            />
            <Avatar
              alt="Travis Howard"
              src="https://api-prod-minimal-v4.vercel.app/assets/images/avatars/avatar_2.jpg"
            />
            <Avatar
              alt="Agnes Walker"
              src="https://api-prod-minimal-v4.vercel.app/assets/images/avatars/avatar_3.jpg"
            />
          </AvatarGroup>
        </Box>
      </Stack>
    </Paper>
  );
}
