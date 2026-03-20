import { useSnackbar } from "notistack";
import { useState } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useFormFundForm from "./useFormFundForm";

const useAddForm = (fetchData) => {
  const methods = useFormFundForm();
  const { enqueueSnackbar } = useSnackbar();
  const handleErrors = useErrors();
  const [isDebit, setIsDebit] = useState(false);
  const onSubmit =
    (isDebit = false) =>
    async (inputData) => {
      setIsDebit(isDebit);
      const reqData = new FormData();
      Object.entries(inputData).forEach(([key, value]) =>
        reqData.append(key, value)
      );
      try {
        const URL = "/api/admin/";
        const URI = isDebit ? `${URL}debit-fund` : `${URL}credit-fund`;
        const { status, data } = await axiosInstance.post(URI, reqData);
        if (status === 200) {
          enqueueSnackbar(data.message);
          methods.reset({ wallet_type: "", user_id: "" });
          fetchData();
          // setSearchTerm("");
        }
      } catch (error) {
        handleErrors(error);
      }
    };

  return { isDebit, methods, onSubmit: onSubmit };
};

export default useAddForm;
