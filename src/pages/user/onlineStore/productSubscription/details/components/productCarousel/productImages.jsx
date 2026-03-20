import { useEffect, useRef, useState } from "react";
import Main from "./main";
import Thumbnails from "./thumbnails";

const ProductImages = ({ images, handleOpenLightbox }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [nav1, setNav1] = useState();

  const [nav2, setNav2] = useState();

  const slider1 = useRef(null);

  const slider2 = useRef(null);
  useEffect(() => {
    if (slider1.current) {
      setNav1(slider1.current);
    }
    if (slider2.current) {
      setNav2(slider2.current);
    }
  }, []);

  return (
    <>
      <Main
        currentIndex={currentIndex}
        handleOpenLightbox={handleOpenLightbox}
        images={images}
        nav={nav2}
        slider={slider1}
        setCurrentIndex={setCurrentIndex}
      />

      <Thumbnails
        images={images}
        currentIndex={currentIndex}
        nav={nav1}
        slider={slider2}
      />
    </>
  );
};

export default ProductImages;
