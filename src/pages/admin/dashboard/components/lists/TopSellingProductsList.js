import {
  Box,
  Button,
  Card,
  CardHeader,
  Paper,
  Stack,
  TableCell,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import Iconify from "src/components/Iconify";
import Image from "src/components/Image";
import Trim from "src/components/Trim";
import { CarouselArrows } from "src/components/carousel";
import { BodyRow } from "src/components/custom-table";
import EmptyTable from "src/components/emptyTable";
import Map from "src/components/map";
import Translate from "src/components/translate";

import { trim } from "src/pages/admin/store/productCategories/Components/ProductCategory";
import axiosInstance from "src/utils/axios";

const useTopSellingProduct = () => {
  const [topSelling, setTopSelling] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance.get(
          "/api/admin/dashboard/top-selling-product"
        );

        if (status === 200) {
          setTopSelling(data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return topSelling;
};

export default function TopSellingProductList() {
  const topSelling = useTopSellingProduct();
  const theme = useTheme();
  const carouselRef = useRef(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
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

  const isEmpty = !Boolean(topSelling?.length);

  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ minHeight: 100 }}>
        <CardHeader
          title={
            <Typography variant="subtitle2">
              <Translate>{"business.topSellingProduct"}</Translate>
            </Typography>
          }
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

        {isEmpty ? (
          <Box align="center">
            <EmptyTable title="No Data Available" />
          </Box>
        ) : (
          <Slider ref={carouselRef} {...settings}>
            {topSelling.map((item) => (
              <BookingItem key={item.id} {...item} />
            ))}
          </Slider>
        )}
      </Box>

      {/* <Box sx={{ p: 1, textAlign: "right" }}>
        <Button
          size="small"
          color="primary"
          endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
        >
          {("business.viewMore")}
        </Button>
      </Box> */}
    </Card>
  );
}

BookingItem.propTypes = {
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

function BookingItem(props) {
  const { product } = props;
  const {
    name,
    product_images: images,
    product_description: description,
  } = product;

  var stripedHtml = description?.replace(/<[^>]+>/g, "");

  return (
    <Paper sx={{ mx: 1.5, borderRadius: 2, bgcolor: "background.neutral" }}>
      <Box sx={{ position: "relative" }}>
        <Image
          src={images[0]?.image_url}
          ratio="1/1"
          sx={{ borderRadius: 1 }}
        />
      </Box>
      <Stack sx={{ p: 1.5, pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <div>
            <Typography variant="subtitle2">
              <Trim value={name} />
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: "text.disabled", mt: 0.5, display: "block" }}
            >
              {stripedHtml ? stripedHtml?.slice(0, 20) : " "}
            </Typography>
          </div>
        </Stack>
      </Stack>
    </Paper>
  );
}
