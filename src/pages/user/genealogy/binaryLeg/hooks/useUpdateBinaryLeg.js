import { useSnackbar } from "notistack";
import { useState } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useUpdateBinaryLeg = (value) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleErrors = useErrors();

  const onSubmit = async () => {
    const reqData = new FormData();
    reqData.append("binary_leg_settings", value);
    try {
      const { status, data } = await axiosInstance.post(
        "/api/binary-leg-settings",
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  return onSubmit;
};

export default useUpdateBinaryLeg;
