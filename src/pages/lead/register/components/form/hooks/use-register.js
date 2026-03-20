import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { PATH_AUTH } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import * as Yup from "yup";

const leadSchema = Yup.object().shape({
  email: Yup.string()
    .email("errors.lead_capture.email.required")
    .required("errors.lead_capture.email.required"),
  name: Yup.string().required("errors.lead_capture.name.required"),
  mobile: Yup.string().required("errors.lead_capture.mobile.required"),
});

const useRegister = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
    },
  });

  const { referral } = useParams();
  const { setError } = methods;

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));

    try {
      const { data } = await axiosInstance.post(
        `/api/lead-capture-store/${referral}`,
        reqData
      );

      const { status, message } = data;
      if (status) {
        enqueueSnackbar(message);
        navigate(PATH_AUTH.login);
      }
    } catch (err) {
      Object.entries(err.errors).forEach(([k, v]) =>
        setError(k, { message: v[0] })
      );
    }
  };

  return { methods, onSubmit };
};

export default useRegister;
