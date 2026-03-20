import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import useErrors from "src/hooks/useErrors";
import { PATH_USER } from "src/routes/paths";
import fetchUser from "src/utils/fetchUser";
import * as Yup from "yup";

const schema = Yup.object().shape({
  rating: Yup.number()
    .min(1, "Rating is required")
    .required("Rating is required"),
  comment: Yup.string().required("Comment is required"),
  title: Yup.string().required("Title is required"),
});

const defaultValues = {
  product_id: "",
  rating: 0,
  comment: "",
  title: "",
};

const useReview = () => {
  const { enqueueSnackbar } = useSnackbar();
  const handleErrors = useErrors();
  const navigate = useNavigate();
  const { id } = useParams();
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );

    try {
      const { message, status } = await (
        await fetchUser.post("user-reviews", reqData)
      ).data;
      if (status) {
        enqueueSnackbar(message);
        navigate(PATH_USER.subscriptions.root);
        return;
      }
      enqueueSnackbar(message, { variant: "error" });
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    methods.setValue("product_id", id);
  }, [id]);

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useReview;
