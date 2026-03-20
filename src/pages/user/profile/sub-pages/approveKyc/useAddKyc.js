import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";
import * as yup from "yup";
import axiosInstance from "src/utils/axios";
import useAuth from "src/hooks/useAuth";
import useFormKyc, { documentFormDefaultValues } from "./useFormKyc";

const useAddKyc = (id) => {
  const methods = useFormKyc();
  const { enqueueSnackbar } = useSnackbar();
  const { user, getUser } = useAuth();
  const handleError = useErrors();
  const onSubmit = async (data) => {
    if (!data.kyc_identity_proof.length) {
      methods.setError("document_url", "Document is required");
      return;
    }
    if (!data.kyc_address_proof.length) {
      methods.setError("document_url", "Document is required");
      return;
    }

    const URI = "api/kyc-details";

    try {
      const {
        status,
        data: resData,
        message,
      } = await axiosInstance.post(URI, genDocData(data, id));

      if (status === 200) {
        enqueueSnackbar(resData.message);
        getUser();
        methods.reset(documentFormDefaultValues);
      }
    } catch (err) {
      console.log(err);
      handleError(err);
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

const genDocData = (data, id) => {
  const reqData = new FormData();
  reqData.append("kyc_identity_proof", data.kyc_identity_proof[0]);
  reqData.append("kyc_address_proof", data.kyc_address_proof[0]);
  reqData.append("user_id", id);

  return reqData;
};

export default useAddKyc;
