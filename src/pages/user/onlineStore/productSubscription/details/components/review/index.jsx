import { Collapse, Divider } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import Form from "./form";
import List from "./list";
import OverView from "./overview";

const Review = ({ product }) => {
  const [reviewBox, setReviewBox] = useState(false);

  const handleOpenReviewBox = () => {
    setReviewBox((prev) => !prev);
  };

  const handleCloseReviewBox = () => {
    setReviewBox(false);
  };

  return (
    <>
      <OverView product={product} onOpen={handleOpenReviewBox} />

      <Divider />

      <Collapse in={reviewBox}>
        <Form onClose={handleCloseReviewBox} id="move_add_review" />
        <Divider />
      </Collapse>

      <List product={product} />
    </>
  );
};

Review.propTypes = {
  product: PropTypes.object,
};

export default Review;
