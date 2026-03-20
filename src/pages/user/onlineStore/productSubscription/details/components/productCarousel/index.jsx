import { styled } from "@mui/material/styles";
import { useState } from "react";
import Image from "src/components/Image";
import Ternary from "src/components/ternary";
import LightboxModel from "./LightboxModal";
import ImageWrapper from "./imageWrapper";
import ProductImages from "./productImages";
import "./style.css";
import Thumbnails from "./thumbnails";

const RootStyle = styled("div")(({ theme }) => ({
  "& .slick-slide": {
    float: theme.direction === "rtl" ? "right" : "left",
    "&:focus": { outline: "none" },
  },
}));

const DetailsCarousel = ({ images = [] }) => {
  const [openLightbox, setOpenLightbox] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);

  const handleOpenLightbox = (url) => {
    const selectedImage = images.findIndex((index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };

  const onlyOneImage = images?.length === 1;

  return (
    <RootStyle>
      <Ternary
        when={images?.length > 0}
        then={
          <Ternary
            when={onlyOneImage}
            then={
              <ImageWrapper>
                <Image
                  alt="large image"
                  src={images[0]}
                  ratio="16/9"
                  onClick={() => handleOpenLightbox(images[0])}
                  sx={{ cursor: "zoom-in", borderRadius: 2 }}
                />

                <Thumbnails currentIndex={0} images={images} />
              </ImageWrapper>
            }
            otherwise={
              <ImageWrapper>
                <ProductImages
                  images={images}
                  handleOpenLightbox={handleOpenLightbox}
                />
              </ImageWrapper>
            }
          />
        }
      />

      <LightboxModel
        images={images}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
      />
    </RootStyle>
  );
};

export default DetailsCarousel;
