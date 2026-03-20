import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const useReviewForm = () => {
  const defaultValues = {
    product_id: "",
    rating: 0,
    comment: "",
    title: "",
  };
  const Schema = Yup.object().shape({
    rating: Yup.number()
      .min(1, "Rating is required")
      .required("Rating is required"),
    comment: Yup.string().required("Review is required"),
    title: Yup.string().required("Title is required"),
  });
  return useForm({ defaultValues, resolver: yupResolver(Schema) });
};

export default useReviewForm;
