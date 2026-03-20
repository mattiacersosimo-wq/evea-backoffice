import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Slider from "react-slick";
import Image from "src/components/Image";

const THUMB_SIZE = 64;

const Thumbnails = ({ images, nav, currentIndex, slider }) => {
  const settings = {
    dots: false,
    arrows: false,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: true,
    centerPadding: "0px",
    slidesToShow: images?.length > 3 ? 3 : images?.length,
  };

  return (
    <Box
      sx={{
        my: 3,
        mx: "auto",
        "& .slick-current .isActive": { opacity: 1 },
        ...(images?.length === 1 && {
          maxWidth: THUMB_SIZE * 1 + 16,
        }),
        ...(images?.length === 2 && {
          maxWidth: THUMB_SIZE * 2 + 32,
        }),
        ...(images?.length === 3 && {
          maxWidth: THUMB_SIZE * 3 + 48,
        }),
        ...(images?.length === 4 && {
          maxWidth: THUMB_SIZE * 3 + 48,
        }),
        ...(images?.length >= 5 && { maxWidth: THUMB_SIZE * 6 }),
        ...(images?.length > 2 && {
          position: "relative",
          "&:before, &:after": {
            top: 0,
            zIndex: 9,
            content: "''",
            height: "100%",
            position: "absolute",
            width: (THUMB_SIZE * 2) / 3,
            backgroundImage: (theme) =>
              `linear-gradient(to left, ${alpha(
                theme.palette.background.paper,
                0
              )} 0%, ${theme.palette.background.paper} 100%)`,
          },
          "&:after": { right: 0, transform: "scaleX(-1)" },
        }),
      }}
    >
      <Slider {...settings} asNavFor={nav} ref={slider}>
        {images?.map((url, index) => (
          <Box key={url} sx={{ px: 0.75 }}>
            <Image
              disabledEffect
              alt="thumb image"
              src={url}
              sx={{
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                borderRadius: 1.5,
                cursor: "pointer",
                ...(currentIndex === index && {
                  border: (theme) => `solid 3px ${theme.palette.primary.main}`,
                }),
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default Thumbnails;
