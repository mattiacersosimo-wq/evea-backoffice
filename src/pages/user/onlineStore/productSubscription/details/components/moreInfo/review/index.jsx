import { Collapse, Divider } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import usePagination from "src/components/pagination/usePagination";
import Ternary from "src/components/ternary";
import useAuth from "src/hooks/useAuth";
import fetchUser from "src/utils/fetchUser";
import Form from "./form";
import List from "./list";
import OverView from "./overview";

const Review = ({ product }) => {
  const {
    user: { id: uid },
  } = useAuth();
  const [reviewBox, setReviewBox] = useState(false);
  const [reviews, setReviews] = useState([]);
  const handleOpenReviewBox = () => {
    setReviewBox((prev) => !prev);
  };
  const { count, onChange, page, rowStart, seed } = usePagination();
  const { id: productId } = product;

  const handleCloseReviewBox = () => {
    setReviewBox(false);
  };

  const fetchReviews = async (id) => {
    const URI = `product-reviews/${id}`;

    try {
      const { status, data } = await fetchUser(URI);
      if (status === 200) {
        const { last_page, data: list, from } = data?.data || {};
        seed(last_page, from);
        setReviews(list);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
    }
  }, [productId]);
  const [notReviewed, setNotReviewed] = useState(false);

  useEffect(() => {
    if (reviews?.length > 0) {
      setNotReviewed(reviews.findIndex(({ user }) => user?.id === uid) < 0);
    }
  }, [reviews, uid]);
  return (
    <>
      <OverView
        product={product}
        onOpen={handleOpenReviewBox}
        notReviewed={notReviewed}
      />

      <Divider />
      <Ternary
        when={notReviewed}
        then={
          <Collapse in={reviewBox}>
            <Form
              onClose={handleCloseReviewBox}
              id="move_add_review"
              product_id={product.id}
              reload={fetchReviews}
            />
            <Divider />
          </Collapse>
        }
      />

      <List reviews={reviews} count={count} onChange={onChange} page={page} />
    </>
  );
};

Review.propTypes = {
  product: PropTypes.object,
};

export default Review;
