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
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import Iconify from "src/components/Iconify";
import { CarouselArrows } from "src/components/carousel";

const RankItem = ({ members = [], label }) => {
  const theme = useTheme();
  const [total, setTotal] = useState();
  const carouselRef = useRef(null);

  const settings = {
    dots: false,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === "rtl"),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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

  useEffect(() => {
    if (members?.length) {
      setTotal(members.reduce((acc, { count }) => acc + count, 0));
    }
  }, [members]);
  const emptySpaces =
    members.length < 5 ? [...new Array(4 - members.length)] : [];

  return (
    <Box sx={{ py: 2 }}>
      <CardHeader
        title={<Typography variant="subtitle2">{label}</Typography>}
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
        {members?.map((item) => (
          <RightTeamList key={item.id} item={item} total={total} />
        ))}
        {emptySpaces.map((i) => (
          <span key={i} />
        ))}
      </Slider>
    </Box>
  );
};

// ----------------------------------------------------------------------

RightTeamList.propTypes = {
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

function RightTeamList({ item, total }) {
  const {
    count,
    images,
    rank: { rank_name },
  } = item;

  const progress = (count / total) * 100;
  return (
    <Paper sx={{ mx: 1.5, borderRadius: 2, bgcolor: "background.neutral" }}>
      <Stack spacing={2.5} sx={{ p: 3, pb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <div>
            <Typography variant="subtitle2">
              <Iconify icon="el:star-alt" /> &nbsp;&nbsp;{rank_name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", mt: 0.5, display: "block" }}
            >
              {count}
            </Typography>
          </div>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          color="primary"
        />
        <Box>
          <AvatarGroup
            max={4}
            sx={{
              "& .MuiAvatar-root": { width: 32, height: 32 },
            }}
            total={count}
          >
            {images?.slice(0, 3).map((item) => (
              <Avatar alt="user profile" src={item} />
            ))}
          </AvatarGroup>
        </Box>
      </Stack>
    </Paper>
  );
}

export default RankItem;
