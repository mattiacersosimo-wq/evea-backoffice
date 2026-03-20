import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";
import useReviewForm from "./useReviewForm";

const useGetUserReviewById = () => {
  const methods = useReviewForm();
  const [review, setReview] = useState("");
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          `/api/user/user-reviews/${id}`
        );

        if (status === 200) {
          const { product_id, rating, comment, title, id } = data.data;
          setReview(data);
          methods.reset({
            product_id,
            rating,
            comment,
            title,
          });
        }
      } catch (err) {
        // Object.values(err).flatMap((item) =>
        //   enqueueSnackbar(item, { variant: "error" })
        // );
        console.log(err);
      }
    };

    fetchData();
  }, [id]);
  return { methods, review };
};

export default useGetUserReviewById;
